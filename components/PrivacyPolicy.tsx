import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-3xl w-full bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center gap-4 flex-shrink-0">
          <div className="p-3 bg-indigo-900/50 rounded-full">
            <Shield className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">プライバシーポリシー</h1>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">1. はじめに</h2>
            <p>
              「簿記トレーニング大戦」（以下、「本アプリ」）は、Toyama Digital Works（以下、「当方」）が提供するWebアプリケーションです。
              本アプリにおけるユーザー情報の取り扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」）を定めます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">2. 収集する情報</h2>
            <p className="mb-2">本アプリでは、サービスの向上と利用状況の把握のために、以下の情報を収集することがあります。</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
              <li>プレイ履歴（スコア、クリア状況など）</li>
              <li>アクセスログ（IPアドレス、ブラウザの種類、アクセス日時など）</li>
              <li>Cookieおよび類似技術を用いた利用データ</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">※個人を特定できる情報（氏名、住所、電話番号など）は、ユーザーが任意に入力するニックネーム等を除き、原則として収集しません。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">3. Google Analytics の利用について</h2>
            <p>
              本アプリでは、利用状況を把握するために Google 社の提供するアクセス解析ツール「Google Analytics」を利用しています。
              Google Analytics は Cookie を使用してデータを収集しますが、このデータは匿名で収集されており、個人を特定するものではありません。
            </p>
            <p className="mt-2">
              この機能は Cookie を無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
              Google Analytics の利用規約および Google 社のプライバシーポリシーについては、以下のリンク先をご確認ください。
            </p>
            <div className="mt-2 flex flex-col gap-1 text-indigo-400">
              <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" className="hover:underline">Google Analytics 利用規約</a>
              <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="hover:underline">Google プライバシーポリシー</a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">4. 免責事項</h2>
            <p>
              本アプリに掲載されている簿記の問題や解説は、学習の補助を目的として作成されていますが、その正確性や完全性を保証するものではありません。
              本アプリの利用によって生じた損害等について、当方は一切の責任を負いません。
              また、日商簿記検定の出題範囲の変更等により、内容が最新でない場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 border-l-4 border-indigo-500 pl-3">5. お問い合わせ</h2>
            <p>
              本アプリに関するお問い合わせや不具合の報告は、開発者のX（旧Twitter）アカウントへのDM（ダイレクトメッセージ）にて受け付けております。
            </p>
            <div className="mt-2">
              <a href="https://x.com/ikasumi_dev" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-2">
                @ikasumi_dev (X)
              </a>
            </div>
          </section>

          <div className="pt-8 text-center text-xs text-slate-500">
            <p>2025年11月21日 制定</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
          <button 
            onClick={onBack}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            戻る
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
