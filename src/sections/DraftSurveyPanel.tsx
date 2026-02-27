import { useState, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Download, Info, Table, BookOpen, Ship } from 'lucide-react';
import { ToastContext } from '@/App';
import { useLanguage } from '@/App';

interface HydrostaticEntry {
  draft: number;
  displacement: number;
  tpc: number;
  lcf: number;
  mtc: number;
}

// Sample hydrostatic table - user can customize this
const defaultHydrostaticTable: HydrostaticEntry[] = [
  { draft: 1.0, displacement: 450, tpc: 12.5, lcf: 0.5, mtc: 85 },
  { draft: 1.5, displacement: 512, tpc: 12.6, lcf: 0.4, mtc: 87 },
  { draft: 2.0, displacement: 575, tpc: 12.7, lcf: 0.3, mtc: 89 },
  { draft: 2.5, displacement: 639, tpc: 12.8, lcf: 0.2, mtc: 91 },
  { draft: 3.0, displacement: 703, tpc: 12.9, lcf: 0.1, mtc: 93 },
  { draft: 3.5, displacement: 768, tpc: 13.0, lcf: 0.0, mtc: 95 },
  { draft: 4.0, displacement: 833, tpc: 13.1, lcf: -0.1, mtc: 97 },
  { draft: 4.5, displacement: 899, tpc: 13.2, lcf: -0.2, mtc: 99 },
  { draft: 5.0, displacement: 965, tpc: 13.3, lcf: -0.3, mtc: 101 },
  { draft: 5.5, displacement: 1032, tpc: 13.4, lcf: -0.4, mtc: 103 },
  { draft: 6.0, displacement: 1099, tpc: 13.5, lcf: -0.5, mtc: 105 },
];

// Linear interpolation function
function interpolate(x: number, x1: number, x2: number, y1: number, y2: number): number {
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

// Get interpolated values from hydrostatic table
function getHydrostaticValues(draft: number, table: HydrostaticEntry[]): HydrostaticEntry | null {
  const sortedTable = [...table].sort((a, b) => a.draft - b.draft);
  let lower = sortedTable[0];
  let upper = sortedTable[sortedTable.length - 1];
  
  for (let i = 0; i < sortedTable.length - 1; i++) {
    if (draft >= sortedTable[i].draft && draft <= sortedTable[i + 1].draft) {
      lower = sortedTable[i];
      upper = sortedTable[i + 1];
      break;
    }
  }
  
  if (draft < sortedTable[0].draft || draft > sortedTable[sortedTable.length - 1].draft) {
    return null;
  }
  
  if (draft === lower.draft) return lower;
  if (draft === upper.draft) return upper;
  
  return {
    draft,
    displacement: interpolate(draft, lower.draft, upper.draft, lower.displacement, upper.displacement),
    tpc: interpolate(draft, lower.draft, upper.draft, lower.tpc, upper.tpc),
    lcf: interpolate(draft, lower.draft, upper.draft, lower.lcf, upper.lcf),
    mtc: interpolate(draft, lower.draft, upper.draft, lower.mtc, upper.mtc),
  };
}

export function DraftSurveyPanel() {
  const { lang } = useLanguage();
  const toast = useContext(ToastContext);
  const { t } = { t: (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      id: {
        'draft.title': 'Draft Survey',
        'draft.subtitle': 'Perhitungan Muatan',
        'draft.initial': 'Draft Awal',
        'draft.final': 'Draft Akhir',
        'draft.forward': 'Muka',
        'draft.midship': 'Tengah',
        'draft.aft': 'Belakang',
        'draft.port': 'Kiri',
        'draft.starboard': 'Kanan',
        'draft.parameters': 'Parameter',
        'draft.waterplaneArea': 'Luas Waterplane',
        'draft.coefficient': 'Koefisien',
        'draft.density': 'Densitas',
        'draft.cargo': 'BERAT MUATAN',
        'draft.formula': 'Formula',
        'draft.hydrostatic': 'Tabel Hidrostatik',
        'draft.method': 'Metode',
        'draft.meanDraft': 'Mean Draft',
        'draft.tpc': 'TPC',
        'draft.lcf': 'LCF',
        'draft.mtc': 'MTC',
        'draft.displacement': 'Displacement',
        'draft.apparentTrim': 'Apparent Trim',
        'common.calculate': 'HITUNG',
        'common.clear': 'BERSIHKAN',
        'common.export': 'EXPORT',
        'toast.calculationSuccess': 'Perhitungan berhasil',
        'error.fillAllFields': 'Isi semua draft',
      },
      en: {
        'draft.title': 'Draft Survey',
        'draft.subtitle': 'Cargo Calculation',
        'draft.initial': 'Initial Draft',
        'draft.final': 'Final Draft',
        'draft.forward': 'Forward',
        'draft.midship': 'Midship',
        'draft.aft': 'Aft',
        'draft.port': 'Port',
        'draft.starboard': 'Stbd',
        'draft.parameters': 'Parameters',
        'draft.waterplaneArea': 'Waterplane Area',
        'draft.coefficient': 'Coefficient',
        'draft.density': 'Density',
        'draft.cargo': 'CARGO WEIGHT',
        'draft.formula': 'Formula',
        'draft.hydrostatic': 'Hydrostatic Table',
        'draft.method': 'Method',
        'draft.meanDraft': 'Mean Draft',
        'draft.tpc': 'TPC',
        'draft.lcf': 'LCF',
        'draft.mtc': 'MTC',
        'draft.displacement': 'Displacement',
        'draft.apparentTrim': 'Apparent Trim',
        'common.calculate': 'CALCULATE',
        'common.clear': 'CLEAR',
        'common.export': 'EXPORT',
        'toast.calculationSuccess': 'Calculation successful',
        'error.fillAllFields': 'Please fill all drafts',
      },
      zh: {
        'draft.title': '吃水测量',
        'draft.subtitle': '货物计算',
        'draft.initial': '初始吃水',
        'draft.final': '最终吃水',
        'draft.forward': '前',
        'draft.midship': '中',
        'draft.aft': '后',
        'draft.port': '左舷',
        'draft.starboard': '右舷',
        'draft.parameters': '参数',
        'draft.waterplaneArea': '水线面面积',
        'draft.coefficient': '系数',
        'draft.density': '密度',
        'draft.cargo': '货物重量',
        'draft.formula': '公式',
        'draft.hydrostatic': '静水力表',
        'draft.method': '方法',
        'draft.meanDraft': '平均吃水',
        'draft.tpc': 'TPC',
        'draft.lcf': 'LCF',
        'draft.mtc': 'MTC',
        'draft.displacement': '排水量',
        'draft.apparentTrim': '纵倾',
        'common.calculate': '计算',
        'common.clear': '清除',
        'common.export': '导出',
        'toast.calculationSuccess': '计算成功',
        'error.fillAllFields': '请填写所有吃水',
      },
    };
    return translations[lang]?.[key] || key;
  }};

  // Mode selection
  const [mode, setMode] = useState<'formula' | 'table'>('formula');
  
  // Initial Survey Drafts
  const [iFp, setIFp] = useState('');
  const [iFs, setIFs] = useState('');
  const [iMp, setIMp] = useState('');
  const [iMs, setIMs] = useState('');
  const [iAp, setIAp] = useState('');
  const [iAs, setIAs] = useState('');
  
  // Final Survey Drafts
  const [fFp, setFFp] = useState('');
  const [fFs, setFFs] = useState('');
  const [fMp, setFMp] = useState('');
  const [fMs, setFMs] = useState('');
  const [fAp, setFAp] = useState('');
  const [fAs, setFAs] = useState('');
  
  // Formula mode parameters
  const [waterplaneArea, setWaterplaneArea] = useState('');
  const [coefficient, setCoefficient] = useState('0.75');
  const [density, setDensity] = useState('1.015');
  
  // Hydrostatic table
  const [hydrostaticTable, setHydrostaticTable] = useState<HydrostaticEntry[]>(defaultHydrostaticTable);
  const [showTableEditor, setShowTableEditor] = useState(false);
  
  // Results - hidden until calculated
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState<{
    iForwardMean: number;
    iMidshipMean: number;
    iAftMean: number;
    iQuarterMean: number;
    iHydroValues: HydrostaticEntry | null;
    fForwardMean: number;
    fMidshipMean: number;
    fAftMean: number;
    fQuarterMean: number;
    fApparentTrim: number;
    fHydroValues: HydrostaticEntry | null;
    cargo: number;
    method: string;
  } | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = useCallback(async () => {
    setError(null);
    setHasCalculated(false);
    setIsCalculating(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const initialDrafts = {
      fp: parseFloat(iFp), fs: parseFloat(iFs),
      mp: parseFloat(iMp), ms: parseFloat(iMs),
      ap: parseFloat(iAp), as: parseFloat(iAs)
    };
    
    const finalDrafts = {
      fp: parseFloat(fFp), fs: parseFloat(fFs),
      mp: parseFloat(fMp), ms: parseFloat(fMs),
      ap: parseFloat(fAp), as: parseFloat(fAs)
    };

    const allDrafts = [...Object.values(initialDrafts), ...Object.values(finalDrafts)];
    if (allDrafts.some(isNaN)) {
      setError(t('error.fillAllFields'));
      setIsCalculating(false);
      return;
    }

    const iForwardMean = (initialDrafts.fp + initialDrafts.fs) / 2;
    const iMidshipMean = (initialDrafts.mp + initialDrafts.ms) / 2;
    const iAftMean = (initialDrafts.ap + initialDrafts.as) / 2;
    const iQuarterMean = (iForwardMean + iAftMean) / 2;

    const fForwardMean = (finalDrafts.fp + finalDrafts.fs) / 2;
    const fMidshipMean = (finalDrafts.mp + finalDrafts.ms) / 2;
    const fAftMean = (finalDrafts.ap + finalDrafts.as) / 2;
    const fQuarterMean = (fForwardMean + fAftMean) / 2;
    const fApparentTrim = fAftMean - fForwardMean;

    let cargo = 0;
    let method = '';
    let iHydroValues: HydrostaticEntry | null = null;
    let fHydroValues: HydrostaticEntry | null = null;

    if (mode === 'formula') {
      const wpArea = parseFloat(waterplaneArea);
      if (isNaN(wpArea) || wpArea <= 0) {
        setError('Please enter valid Waterplane Area');
        setIsCalculating(false);
        return;
      }
      const coeff = parseFloat(coefficient) || 0.75;
      const dens = parseFloat(density) || 1.015;
      
      const deltaDraft = fQuarterMean - iQuarterMean;
      const volume = (wpArea * deltaDraft) / coeff;
      cargo = volume * dens;
      method = `Formula (WP:${wpArea}m², C:${coeff}, D:${dens})`;
    } else {
      iHydroValues = getHydrostaticValues(iQuarterMean, hydrostaticTable);
      fHydroValues = getHydrostaticValues(fQuarterMean, hydrostaticTable);
      
      if (!iHydroValues || !fHydroValues) {
        setError(`Draft out of range (${hydrostaticTable[0].draft}-${hydrostaticTable[hydrostaticTable.length - 1].draft}m)`);
        setIsCalculating(false);
        return;
      }
      
      cargo = fHydroValues.displacement - iHydroValues.displacement;
      method = 'Hydrostatic Table';
    }

    setResult({
      iForwardMean, iMidshipMean, iAftMean, iQuarterMean, iHydroValues,
      fForwardMean, fMidshipMean, fAftMean, fQuarterMean, fHydroValues, fApparentTrim,
      cargo, method
    });

    setHasCalculated(true);
    toast.success?.(`${t('draft.cargo')}: ${cargo.toFixed(3)} MT`, 3000);
    setIsCalculating(false);
  }, [iFp, iFs, iMp, iMs, iAp, iAs, fFp, fFs, fMp, fMs, fAp, fAs, waterplaneArea, coefficient, density, mode, hydrostaticTable, toast, t]);

  const clearAll = useCallback(() => {
    setIFp(''); setIFs(''); setIMp(''); setIMs(''); setIAp(''); setIAs('');
    setFFp(''); setFFs(''); setFMp(''); setFMs(''); setFAp(''); setFAs('');
    setWaterplaneArea('');
    setHasCalculated(false);
    setResult(null);
    setError(null);
    toast.info?.('All fields cleared', 2000);
  }, [toast]);

  const exportReport = useCallback(() => {
    if (!result) return;
    
    const report = `
DRAFT SURVEY REPORT
===================
Method: ${result.method}

INITIAL SURVEY:
- Forward: Port ${iFp}m / Stbd ${iFs}m → Mean ${result.iForwardMean.toFixed(4)}m
- Midship: Port ${iMp}m / Stbd ${iMs}m → Mean ${result.iMidshipMean.toFixed(4)}m
- Aft: Port ${iAp}m / Stbd ${iAs}m → Mean ${result.iAftMean.toFixed(4)}m
- Quarter Mean: ${result.iQuarterMean.toFixed(4)}m
${result.iHydroValues ? `- Displacement: ${result.iHydroValues.displacement.toFixed(2)} MT` : ''}

FINAL SURVEY:
- Forward: Port ${fFp}m / Stbd ${fFs}m → Mean ${result.fForwardMean.toFixed(4)}m
- Midship: Port ${fMp}m / Stbd ${fMs}m → Mean ${result.fMidshipMean.toFixed(4)}m
- Aft: Port ${fAp}m / Stbd ${fAs}m → Mean ${result.fAftMean.toFixed(4)}m
- Quarter Mean: ${result.fQuarterMean.toFixed(4)}m
- Apparent Trim: ${result.fApparentTrim.toFixed(4)}m
${result.fHydroValues ? `- Displacement: ${result.fHydroValues.displacement.toFixed(2)} MT` : ''}

RESULT:
- CARGO: ${result.cargo.toFixed(3)} MT

Report generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DraftSurvey_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success?.('Report exported', 2000);
  }, [result, iFp, iFs, iMp, iMs, iAp, iAs, fFp, fFs, fMp, fMs, fAp, fAs, toast]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center mb-4">
        <Ship className="w-8 h-8 mx-auto text-[#00eaff] mb-1" />
        <h2 className="text-sm font-semibold text-[#00eaff]">{t('draft.title')}</h2>
        <p className="text-[10px] text-[#7feaff]">{t('draft.subtitle')}</p>
      </div>

      {/* Mode Selection */}
      <div className="bg-[#021019] rounded-lg p-2.5 border border-[#00eaff33]">
        <Label className="text-[10px] text-[#7fd3ff] mb-2 block">{t('draft.method')}</Label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('formula')}
            className={`flex-1 py-1.5 px-2 rounded text-[10px] transition-all ${
              mode === 'formula' 
                ? 'bg-[#00eaff22] border border-[#00eaff] text-[#00eaff]' 
                : 'bg-[#000c14] border border-[#00eaff22] text-[#9fe9ff]'
            }`}
          >
            <Calculator className="w-3 h-3 mx-auto mb-0.5" />
            {t('draft.formula')}
          </button>
          <button
            onClick={() => setMode('table')}
            className={`flex-1 py-1.5 px-2 rounded text-[10px] transition-all ${
              mode === 'table' 
                ? 'bg-[#00eaff22] border border-[#00eaff] text-[#00eaff]' 
                : 'bg-[#000c14] border border-[#00eaff22] text-[#9fe9ff]'
            }`}
          >
            <Table className="w-3 h-3 mx-auto mb-0.5" />
            {t('draft.hydrostatic')}
          </button>
        </div>
      </div>

      {/* Formula Mode Parameters */}
      {mode === 'formula' && (
        <div className="bg-[#021019] rounded-lg p-2.5 border border-[#00eaff33]">
          <div className="text-[10px] text-[#7fd3ff] font-medium mb-2">{t('draft.parameters')}</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.waterplaneArea')} (m²)</Label>
              <Input
                type="number"
                placeholder="e.g. 2184"
                value={waterplaneArea}
                onChange={(e) => setWaterplaneArea(e.target.value)}
                className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1"
                min={0}
                step={0.1}
              />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.coefficient')}</Label>
              <Input
                type="number"
                placeholder="0.75"
                value={coefficient}
                onChange={(e) => setCoefficient(e.target.value)}
                className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1"
                min={0.1}
                max={1}
                step={0.01}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.density')} (MT/m³)</Label>
              <Input
                type="number"
                placeholder="1.015"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1"
                min={0.9}
                max={1.1}
                step={0.001}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table Mode - Keep as is */}
      {mode === 'table' && (
        <div className="bg-[#021019] rounded-lg p-2.5 border border-[#00eaff33]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-[#7fd3ff] font-medium">{t('draft.hydrostatic')}</div>
            <button
              onClick={() => setShowTableEditor(!showTableEditor)}
              className="text-[9px] text-[#00eaff] hover:underline"
            >
              {showTableEditor ? 'Hide' : 'Edit'}
            </button>
          </div>
          
          <div className="text-[9px] text-[#7feaff] mb-1">
            Range: {hydrostaticTable[0].draft}m - {hydrostaticTable[hydrostaticTable.length - 1].draft}m
          </div>
          
          {showTableEditor && (
            <div className="mb-3 p-2 bg-[#000c14] rounded border border-[#00eaff33]">
              <div className="text-[9px] text-[#7feaff] mb-1">
                <BookOpen className="w-3 h-3 inline mr-1" />
                Edit table (Draft, Disp, TPC, LCF, MTC)
              </div>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-[#7feaff]">
                      <th className="p-0.5">Draft</th>
                      <th className="p-0.5">Disp</th>
                      <th className="p-0.5">TPC</th>
                      <th className="p-0.5">LCF</th>
                      <th className="p-0.5">MTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hydrostaticTable.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="p-0.5">
                          <Input
                            type="number"
                            value={entry.draft}
                            onChange={(e) => {
                              const newTable = [...hydrostaticTable];
                              newTable[idx].draft = parseFloat(e.target.value) || 0;
                              setHydrostaticTable(newTable);
                            }}
                            className="w-12 h-5 text-[10px] bg-[#021019] border-[#00eaff33] text-white text-center p-0"
                            step={0.1}
                          />
                        </td>
                        <td className="p-0.5">
                          <Input
                            type="number"
                            value={entry.displacement}
                            onChange={(e) => {
                              const newTable = [...hydrostaticTable];
                              newTable[idx].displacement = parseFloat(e.target.value) || 0;
                              setHydrostaticTable(newTable);
                            }}
                            className="w-12 h-5 text-[10px] bg-[#021019] border-[#00eaff33] text-white text-center p-0"
                          />
                        </td>
                        <td className="p-0.5">
                          <Input
                            type="number"
                            value={entry.tpc}
                            onChange={(e) => {
                              const newTable = [...hydrostaticTable];
                              newTable[idx].tpc = parseFloat(e.target.value) || 0;
                              setHydrostaticTable(newTable);
                            }}
                            className="w-10 h-5 text-[10px] bg-[#021019] border-[#00eaff33] text-white text-center p-0"
                            step={0.1}
                          />
                        </td>
                        <td className="p-0.5">
                          <Input
                            type="number"
                            value={entry.lcf}
                            onChange={(e) => {
                              const newTable = [...hydrostaticTable];
                              newTable[idx].lcf = parseFloat(e.target.value) || 0;
                              setHydrostaticTable(newTable);
                            }}
                            className="w-10 h-5 text-[10px] bg-[#021019] border-[#00eaff33] text-white text-center p-0"
                            step={0.1}
                          />
                        </td>
                        <td className="p-0.5">
                          <Input
                            type="number"
                            value={entry.mtc}
                            onChange={(e) => {
                              const newTable = [...hydrostaticTable];
                              newTable[idx].mtc = parseFloat(e.target.value) || 0;
                              setHydrostaticTable(newTable);
                            }}
                            className="w-10 h-5 text-[10px] bg-[#021019] border-[#00eaff33] text-white text-center p-0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setHydrostaticTable([...hydrostaticTable, { draft: 0, displacement: 0, tpc: 0, lcf: 0, mtc: 0 }])}
                className="mt-1 w-full py-1 bg-[#0a2a3a] text-[#9fe9ff] rounded text-[9px] hover:bg-[#0d3a4d]"
              >
                + Add Row
              </button>
            </div>
          )}
        </div>
      )}

      {/* Initial Survey */}
      <div className="bg-[#021019] rounded-lg p-2.5 border border-[#00eaff33]">
        <div className="text-[10px] text-[#7fd3ff] font-medium mb-2">{t('draft.initial')} (m)</div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.forward')} {t('draft.port')}</Label>
              <Input value={iFp} onChange={(e) => setIFp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.forward')} {t('draft.starboard')}</Label>
              <Input value={iFs} onChange={(e) => setIFs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.midship')} {t('draft.port')}</Label>
              <Input value={iMp} onChange={(e) => setIMp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.midship')} {t('draft.starboard')}</Label>
              <Input value={iMs} onChange={(e) => setIMs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.aft')} {t('draft.port')}</Label>
              <Input value={iAp} onChange={(e) => setIAp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.aft')} {t('draft.starboard')}</Label>
              <Input value={iAs} onChange={(e) => setIAs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
        </div>
      </div>

      {/* Final Survey */}
      <div className="bg-[#021019] rounded-lg p-2.5 border border-[#00eaff33]">
        <div className="text-[10px] text-[#7fd3ff] font-medium mb-2">{t('draft.final')} (m)</div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.forward')} {t('draft.port')}</Label>
              <Input value={fFp} onChange={(e) => setFFp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.forward')} {t('draft.starboard')}</Label>
              <Input value={fFs} onChange={(e) => setFFs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.midship')} {t('draft.port')}</Label>
              <Input value={fMp} onChange={(e) => setFMp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.midship')} {t('draft.starboard')}</Label>
              <Input value={fMs} onChange={(e) => setFMs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.aft')} {t('draft.port')}</Label>
              <Input value={fAp} onChange={(e) => setFAp(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
            <div>
              <Label className="text-[9px] text-[#7fd3ff]">{t('draft.aft')} {t('draft.starboard')}</Label>
              <Input value={fAs} onChange={(e) => setFAs(e.target.value)} className="w-full h-7 text-[12px] bg-[#000c14] border-[#00eaff33] text-white text-center mt-0.5 px-1" step={0.001} />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={calculate}
          disabled={isCalculating}
          className="flex-1 h-8 bg-[#0a2a3a] text-[#9fe9ff] hover:bg-[#0d3a4d] border border-[#00eaff33] text-[11px] font-medium"
        >
          {isCalculating ? (
            <span className="animate-pulse">...</span>
          ) : (
            <><Calculator className="w-3 h-3 mr-1" />{t('common.calculate')}</>
          )}
        </Button>
        <Button 
          onClick={clearAll}
          variant="outline"
          className="h-8 text-[11px] border-[#00eaff33] text-[#7feaff] hover:bg-[#0a2a3a] px-3"
        >
          {t('common.clear')}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-[10px] animate-shake">
          {error}
        </div>
      )}

      {/* Results - Compact display */}
      {hasCalculated && result && (
        <div className="space-y-2 animate-fade-in-up">
          {/* Method Info */}
          <div className="p-2 bg-[#021019] border border-[#00eaff33] rounded-lg">
            <div className="text-[9px] text-[#7feaff]">
              <Info className="w-3 h-3 inline mr-1" />
              {result.method}
            </div>
          </div>

          {/* Cargo Result - Smaller font */}
          <div className="p-3 bg-[#021019] border border-[#00eaff55] rounded-lg">
            <div className="text-center">
              <div className="text-[10px] text-[#7feaff] mb-0.5">{t('draft.cargo')}</div>
              <div className="text-xl font-bold text-[#00ffd5]">{result.cargo.toFixed(3)} <span className="text-xs">MT</span></div>
            </div>
          </div>

          {/* Initial Survey Details - Compact */}
          <div className="p-2.5 bg-[#021019] border border-[#00eaff33] rounded-lg">
            <div className="text-[10px] text-[#7fd3ff] font-medium mb-1.5">{t('draft.initial')}</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
              <div className="text-[#7feaff]">{t('draft.forward')}:</div>
              <div className="text-white text-right">{result.iForwardMean.toFixed(3)}m</div>
              <div className="text-[#7feaff]">{t('draft.midship')}:</div>
              <div className="text-white text-right">{result.iMidshipMean.toFixed(3)}m</div>
              <div className="text-[#7feaff]">{t('draft.aft')}:</div>
              <div className="text-white text-right">{result.iAftMean.toFixed(3)}m</div>
              <div className="text-[#7fd3ff]">{t('draft.meanDraft')}:</div>
              <div className="text-[#00eaff] text-right font-medium">{result.iQuarterMean.toFixed(3)}m</div>
              {result.iHydroValues && (
                <>
                  <div className="text-[#00ff88]">{t('draft.displacement')}:</div>
                  <div className="text-[#00ff88] text-right">{result.iHydroValues.displacement.toFixed(1)} MT</div>
                </>
              )}
            </div>
          </div>

          {/* Final Survey Details - Compact */}
          <div className="p-2.5 bg-[#021019] border border-[#00eaff33] rounded-lg">
            <div className="text-[10px] text-[#7fd3ff] font-medium mb-1.5">{t('draft.final')}</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
              <div className="text-[#7feaff]">{t('draft.forward')}:</div>
              <div className="text-white text-right">{result.fForwardMean.toFixed(3)}m</div>
              <div className="text-[#7feaff]">{t('draft.midship')}:</div>
              <div className="text-white text-right">{result.fMidshipMean.toFixed(3)}m</div>
              <div className="text-[#7feaff]">{t('draft.aft')}:</div>
              <div className="text-white text-right">{result.fAftMean.toFixed(3)}m</div>
              <div className="text-[#7fd3ff]">{t('draft.meanDraft')}:</div>
              <div className="text-white text-right">{result.fQuarterMean.toFixed(3)}m</div>
              <div className="text-[#ffaa00]">{t('draft.apparentTrim')}:</div>
              <div className="text-[#ffaa00] text-right">{result.fApparentTrim.toFixed(3)}m</div>
              {result.fHydroValues && (
                <>
                  <div className="text-[#00ff88]">{t('draft.displacement')}:</div>
                  <div className="text-[#00ff88] text-right">{result.fHydroValues.displacement.toFixed(1)} MT</div>
                </>
              )}
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={exportReport}
            variant="outline"
            size="sm"
            className="w-full text-[10px] border-[#00eaff33] text-[#7feaff] hover:bg-[#0a2a3a] h-7"
          >
            <Download className="w-3 h-3 mr-1" /> {t('common.export')}
          </Button>
        </div>
      )}
    </div>
  );
}
