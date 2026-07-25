import React, { useEffect, useRef } from 'react';
import { AD_CLIENT } from '../adsConfig';

interface AdUnitProps {
  /** AdSense管理画面で発行される data-ad-slot の値。空文字の場合は何も描画しません。 */
  slot: string;
  /** 広告フォーマット。既定は記事内向けの fluid。 */
  format?: string;
  /** 広告レイアウト（in-article など）。 */
  layout?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense の広告ユニットを安全に表示するコンポーネント。
 * slot が未設定（空文字）の場合は何も描画しないため、審査通過前でも安全に配置できます。
 */
const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'fluid', layout = 'in-article', className }) => {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense未ロード時などは無視（審査通過前・オフライン等）
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={className} aria-hidden="true">
      <p className="text-center text-[10px] uppercase tracking-widest text-slate-500 mb-1">スポンサーリンク</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdUnit;
