import React from 'react';

// 解説の1行を「見出し」「箇条書き」「段落」に分類するための軽量パーサ。
// 既存の解説テキスト（プレーン文字列）をそのまま構造化して見やすく描画する。
// dangerouslySetInnerHTML は使わず、テキストノードのみを描画するため XSS の心配はない。

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'para'; text: string };

const BULLET_RE = /^[・•●○◆▪️]\s*(.*)$/;
const DASH_RE = /^[-–—]\s+(.*)$/;

const parseExplanation = (raw: string): Block[] => {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: 'para', text: para.join('\n') });
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ kind: 'list', items: list });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '') {
      flushPara();
      flushList();
      continue;
    }

    const bullet = line.match(BULLET_RE) || line.match(DASH_RE);
    if (bullet) {
      flushPara();
      list.push(bullet[1]);
      continue;
    }

    // 見出し: 末尾がコロン / 【...】 で囲まれている / 「復習ポイント」で始まる 短い行
    const isHeading =
      /[：:]$/.test(line) ||
      /^【.*】$/.test(line) ||
      (line.startsWith('復習ポイント') && line.length <= 12);
    if (isHeading) {
      flushPara();
      flushList();
      blocks.push({ kind: 'heading', text: line.replace(/[：:]$/, '') });
      continue;
    }

    flushList();
    para.push(line);
  }

  flushPara();
  flushList();
  return blocks;
};

// 「ラベル：内容」の短いラベル部分を太字にして読みやすくする
const renderInline = (text: string): React.ReactNode => {
  const idx = text.search(/[：:]/);
  if (idx > 0 && idx <= 12) {
    return (
      <>
        <span className="font-bold text-slate-100">{text.slice(0, idx + 1)}</span>
        {text.slice(idx + 1)}
      </>
    );
  }
  return text;
};

interface ExplanationBodyProps {
  text: string;
  className?: string;
}

export const ExplanationBody: React.FC<ExplanationBodyProps> = ({ text, className }) => {
  const blocks = parseExplanation(text || '');

  if (blocks.length === 0) {
    return <p className={`text-slate-300 text-sm leading-relaxed break-words ${className ?? ''}`}>{text}</p>;
  }

  return (
    <div className={`text-slate-300 text-sm break-words space-y-2.5 ${className ?? ''}`}>
      {blocks.map((block, i) => {
        if (block.kind === 'heading') {
          return (
            <p
              key={i}
              className="flex items-center gap-2 font-bold text-indigo-200 mt-3 first:mt-0"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              {block.text}
            </p>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={i} className="list-disc list-outside pl-5 space-y-1 marker:text-indigo-400">
              {block.items.map((item, j) => (
                <li key={j} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed whitespace-pre-line">
            {block.text}
          </p>
        );
      })}
    </div>
  );
};

export default ExplanationBody;
