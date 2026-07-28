import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, ClipboardList, FileSpreadsheet, ListChecks, Sword, Table2 } from 'lucide-react';
import { GeneratedProblem, SoundType, StatementAnswer, StatementBlank } from '../types';
import { audioService } from '../services/audioService';

interface StatementProblemFormProps {
  problem: GeneratedProblem;
  onSubmit: (answer: StatementAnswer) => void;
  isSubmitting: boolean;
}

const formatValue = (value: number | string): string => (
  typeof value === 'number' ? `¥${value.toLocaleString()}` : value
);

const formatAmount = (value?: number): string => (
  value === undefined ? '' : `¥${value.toLocaleString()}`
);

const groupBlanks = (blanks: StatementBlank[]): Array<[string, StatementBlank[]]> => {
  const grouped = new Map<string, StatementBlank[]>();
  blanks.forEach(blank => {
    grouped.set(blank.section, [...(grouped.get(blank.section) ?? []), blank]);
  });
  return Array.from(grouped.entries());
};

const StatementProblemForm: React.FC<StatementProblemFormProps> = ({ problem, onSubmit, isSubmitting }) => {
  const statement = problem.statement;
  const [values, setValues] = useState<Record<string, number>>({});
  const groupedBlanks = useMemo(() => groupBlanks(statement?.blanks ?? []), [statement]);
  const amountOptions = problem.amountOptions ?? [];

  useEffect(() => {
    setValues({});
  }, [problem.id]);

  if (!statement) {
    return null;
  }

  const answeredCount = statement.blanks.filter(blank => values[blank.id] !== undefined).length;
  const progress = Math.round((answeredCount / statement.blanks.length) * 100);
  const isComplete = answeredCount === statement.blanks.length;

  const handleChange = (blankId: string, value: string) => {
    audioService.playSfx(SoundType.SFX_SELECT);
    setValues(prev => ({ ...prev, [blankId]: Number(value) }));
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    audioService.playSfx(SoundType.SFX_DECISION);
    onSubmit({ kind: 'statement', values });
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-indigo-500/40 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-950/60 px-3 py-1 text-xs font-bold text-indigo-200 mb-3">
              <FileSpreadsheet size={14} />
              {statement.title}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{statement.description}</p>
          </div>
          <div className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-right">
            <div className="text-[11px] text-slate-500 font-bold">入力状況</div>
            <div className="text-lg font-black text-white font-mono">{answeredCount}/{statement.blanks.length}</div>
          </div>
        </div>
        <div
          className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-label="入力進捗"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={statement.blanks.length}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(420px,1.1fr)] gap-4">
        <div className="space-y-4">
          <section className="bg-slate-900/80 rounded-xl border border-slate-700 p-4">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <ClipboardList size={16} className="text-indigo-300" />
              基本資料
            </h3>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              {statement.materials.map(material => (
                <div key={material.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 rounded-lg bg-slate-800/80 px-3 py-2">
                  <dt className="text-slate-400">{material.label}</dt>
                  <dd className="font-mono font-bold text-slate-100 sm:text-right break-words">{formatValue(material.value)}</dd>
                </div>
              ))}
            </dl>
          </section>

          {statement.trialBalance && statement.trialBalance.length > 0 && (
            <section className="bg-slate-900/80 rounded-xl border border-slate-700 p-4">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Table2 size={16} className="text-sky-300" />
                決算整理前残高試算表
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="min-w-[340px] sm:min-w-[420px] w-full text-xs sm:text-sm">
                  <caption className="sr-only">決算整理前残高試算表</caption>
                  <thead className="bg-slate-950 text-xs text-slate-500">
                    <tr>
                      <th scope="col" className="px-2 sm:px-3 py-2 text-left font-bold">勘定科目</th>
                      <th scope="col" className="px-2 sm:px-3 py-2 text-right font-bold">借方</th>
                      <th scope="col" className="px-2 sm:px-3 py-2 text-right font-bold">貸方</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {statement.trialBalance.map(row => (
                      <tr key={row.account} className="bg-slate-900/70">
                        <th scope="row" className="px-2 sm:px-3 py-2 text-left text-slate-200 font-bold whitespace-nowrap">{row.account}</th>
                        <td className="px-2 sm:px-3 py-2 text-right font-mono text-slate-100 whitespace-nowrap">{formatAmount(row.debit)}</td>
                        <td className="px-2 sm:px-3 py-2 text-right font-mono text-slate-100 whitespace-nowrap">{formatAmount(row.credit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {statement.adjustmentItems && statement.adjustmentItems.length > 0 && (
            <section className="bg-slate-900/80 rounded-xl border border-slate-700 p-4">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <ListChecks size={16} className="text-amber-300" />
                決算整理事項等
              </h3>
              <ol className="space-y-2 text-sm text-slate-300">
                {statement.adjustmentItems.map(item => (
                  <li key={item.label} className="grid grid-cols-[28px_1fr] gap-2 rounded-lg bg-slate-800/80 px-3 py-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-black text-amber-200">
                      {item.label}
                    </span>
                    <span className="leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="bg-slate-900/80 rounded-xl border border-slate-700 p-4">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-300" />
              作成指示
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {statement.requirements.map(requirement => (
                <li key={requirement} className="flex gap-2">
                  <CheckCircle2 size={15} className="text-emerald-300 mt-0.5 shrink-0" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-4">
          {groupedBlanks.map(([section, blanks]) => (
            <section key={section} className="bg-slate-900/80 rounded-xl border border-indigo-500/30 p-4">
              <h3 className="text-base font-black text-white mb-3">{section}</h3>
              <div className="hidden sm:grid grid-cols-[1fr_160px] gap-2 text-xs font-bold text-slate-500 px-2 mb-2">
                <span>項目</span>
                <span className="text-right">金額</span>
              </div>
              <div className="space-y-2">
                {blanks.map(blank => (
                  <label key={blank.id} className="grid sm:grid-cols-[1fr_160px] gap-2 rounded-lg border border-slate-700 bg-slate-800/80 p-3 sm:items-center">
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-100">{blank.label}</span>
                      {blank.hint && <span className="block text-xs text-slate-500 mt-1">{blank.hint}</span>}
                    </span>
                    <select
                      value={values[blank.id] ?? ''}
                      onChange={(event) => handleChange(blank.id, event.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-right font-mono font-bold text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="" disabled>選択</option>
                      {amountOptions.map(amount => (
                        <option key={`${blank.id}-${amount}`} value={amount}>
                          ¥{amount.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete || isSubmitting}
        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <Sword size={22} />
        作成完了！
      </button>
    </div>
  );
};

export default React.memo(StatementProblemForm);
