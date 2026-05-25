import React, { useState } from 'react';
import { Shield, ArrowLeft, Info, FileText, Mail, BookOpen, AlertTriangle } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  initialTab?: TabType;
}

type TabType = 'about' | 'terms' | 'privacy' | 'contact';

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, initialTab = 'about' }) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10 max-w-3xl w-full bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl flex flex-col h-[90vh] md:h-[80vh]">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-900/50 rounded-full">
              <Shield className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">インフォメーション</h1>
              <p className="text-xs text-slate-400">当サイトについて・規約・お問い合わせ</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-700 bg-slate-800/30 flex-shrink-0 overflow-x-auto text-xs md:text-sm">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 min-w-[80px] py-3 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen size={16} />
            当サイトについて
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 min-w-[80px] py-3 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText size={16} />
            利用規約
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 min-w-[80px] py-3 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield size={16} />
            プライバシーポリシー
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 min-w-[80px] py-3 px-2 text-center font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'contact'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail size={16} />
            お問い合わせ
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-sm leading-relaxed">
          
          {/* TAB 1: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <section className="space-y-3">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">「簿記トレーニング大戦」とは？</h2>
                <p>
                  「簿記トレーニング大戦」は、日商簿記3級の学習をゲーミフィケーション（RPG戦闘スタイル）で効果的かつ直感的に行える、完全無料の学習支援Webアプリケーションです。
                </p>
                <p>
                  退屈になりがちな仕訳の反復練習を、かわいい・かっこいいモンスターたちとの白熱バトルに変換！
                  プレイヤーは仕訳問題や金額計算問題に正しく答えることでモンスターに大ダメージを与え、制限時間内に撃破を目指します。
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">本アプリが「日本一」の簿記3級アプリを目指すこだわり</h2>
                <div className="grid gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex gap-2">
                    <span className="text-yellow-400 font-bold">●</span>
                    <p><strong className="text-white">脳に優しい段階的難易度設計：</strong> 練習やEasyモードでは金額の桁数を低く（1.2万〜3万円など）抑えることで、「暗算でサクサク解く快適さ」を最優先にし、仕訳の仕組みや勘定科目の本質に集中できます。一方で、Hardモードでは1,000万円を超える本試験レベルの高額取引が出現し、制限時間つきのプロ向け実践練習が可能です。</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-400 font-bold">●</span>
                    <p><strong className="text-white">網羅的な出題バリエーション：</strong> 3級試験の試験範囲全般をくまなくカバーする多数の厳選問題を用意。売掛金の回収、有形固定資産の売却、決算整理、さらには株式の発行や当座借越契約まで幅広く網羅しています。</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-yellow-400 font-bold">●</span>
                    <p><strong className="text-white">圧倒的な操作性と爽快感：</strong> Web Audio APIを使用した心地よい効果音とBGM、直感的な仕訳フォーム、モンスターの挙動や演出など、モチベーションを持続させる仕組みを詰め込んでいます。</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">運営者情報</h2>
                <div className="text-slate-400 space-y-1 pl-1">
                  <p>■ 運営組織 / 開発者： Toyama Digital Works</p>
                  <p>■ 制作目的： 簿記学習者が挫折せず、楽しく第1問の仕訳を完全攻略できるようにサポートすること</p>
                  <p>■ 公式Webサイト： <a href="https://boki-training.com/" className="text-indigo-400 hover:underline">https://boki-training.com/</a></p>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第1条（規約の適用）</h2>
                <p>
                  本利用規約（以下、「本規約」）は、Toyama Digital Works（以下、「当方」）がWeb上で提供する「簿記トレーニング大戦」（以下、「本アプリ」）の利用条件を定めるものです。
                  本アプリを利用するすべてのユーザーは、本規約に同意したものとみなされます。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第2条（禁止事項）</h2>
                <p>ユーザーは、本アプリの利用にあたり、以下の行為を行ってはなりません。</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                  <li>本アプリのサーバーやネットワークシステムに過度な負担をかける行為</li>
                  <li>自動化スクリプトやツールを用いて、不正にハイスコア等のデータを送信・改ざんする行為</li>
                  <li>有害なコンピュータープログラム等を送信または書き込む行為</li>
                  <li>知的財産権、著作権、プライバシーその他の権利を侵害する行為</li>
                  <li>その他、当方が不適切と判断する一切の行為</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第3条（提供の停止等）</h2>
                <p>
                  当方は、システムの保守・点検、サーバーダウン、法律の改訂、自然災害などの事由が生じた場合、ユーザーに事前に通知することなく本アプリの全部または一部の提供を停止または中断することができるものとします。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第4条（免責事項）</h2>
                <p>
                  本アプリに掲載されている問題、解説、計算結果等の情報は細心の注意を払って作成されていますが、その正確性、適切性、有用性、最新性、または動作について一切保証いたしません。
                </p>
                <div className="flex gap-2 bg-slate-800 p-3 rounded border border-amber-900/40 text-amber-300 text-xs">
                  <AlertTriangle className="flex-shrink-0" size={16} />
                  <p>ユーザーが本アプリを利用したこと、または利用できなかったことによって生じた一切の損害（学習目標の不達成、スコア消失、通信費の増加など）について、当方は賠償責任を負わないものとします。</p>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第5条（準拠法・裁判管轄）</h2>
                <p>
                  本規約の解釈にあたっては、日本法を準拠法とします。本アプリに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">1. 個人情報の収集について</h2>
                <p>
                  「簿記トレーニング大戦」（以下、「本アプリ」）では、ユーザーの利便性向上、ランキングシステムの提供、不具合追跡、および利用状況分析のために、Cookie（クッキー）やローカルストレージ等のブラウザ保存領域、および以下の匿名情報を収集することがあります。
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                  <li>ランキング登録時のニックネーム（任意）</li>
                  <li>スコア、正解数、クリアタイム、コンボ数などのプレイ履歴</li>
                  <li>アクセス解析によって得られる情報（IPアドレス、お使いのブラウザ・端末の種類、アクセス日時等）</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">2. 広告配信サービス（Google AdSense等）の利用</h2>
                <p>
                  当サイトでは、第三者配信事業者であるGoogle社が提供する広告配信サービス「Google AdSense」を利用して広告を表示することがあります。
                </p>
                <p>
                  Google等の広告配信事業者は、ユーザーが過去に当サイトや他のウェブサイトにアクセスした際の情報に基づいて、特に関心のある商品やサービスの広告（パーソナライズ広告）を表示するため、Cookieを使用しています。
                </p>
                <p>
                  ユーザーは、Google社の広告設定によりパーソナライズ広告を無効にできます。また、
                  <a href="https://aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">www.aboutads.info</a> 
                  にアクセスすることで、第三者配信事業者のCookieを無効化できます。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">3. アクセス解析ツールの利用</h2>
                <p>
                  本アプリでは、アクセス解析とサービス改善のために、Google Analytics等のアクセス解析ツールを利用する場合があります。
                  これらのツールはデータ収集にCookieを使用することがありますが、収集されるデータは匿名であり、個人を特定する情報は含まれません。
                </p>
                <p>
                  Cookieを利用した計測は、ブラウザ設定でCookieを無効にすることで拒否可能です。
                  Google社の規約とプライバシーポリシーの詳細は、以下の公式サイトをご覧ください。
                </p>
                <div className="mt-2 flex flex-col gap-1 text-indigo-400 text-xs pl-1">
                  <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" className="hover:underline">● Google Analytics 利用規約</a>
                  <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="hover:underline">● Google プライバシーポリシー</a>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">4. 個人情報の第三者提供</h2>
                <p>
                  本アプリが直接収集する情報はすべて匿名かつ集計データであり、法令に基づく開示請求等がある場合を除き、個人を特定可能な情報を第三者に提供・販売することは一切ありません。
                </p>
              </section>

              <div className="pt-4 text-right text-xs text-slate-500">
                <p>2024年11月21日 制定</p>
                <p>2026年5月21日 改訂（広告配信ポリシーの追記）</p>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <section className="space-y-3">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">お問い合わせ窓口</h2>
                <p>
                  本アプリ「簿記トレーニング大戦」に関するご要望、応援メッセージ、不具合の報告、お仕事などのご相談は以下の手段にて承っております。
                </p>
                <p>
                  ユーザーの皆様からいただいたフィードバックや応援の言葉は、アプリの品質・問題アップデートの何よりの原動力となります。お気軽にご連絡ください！
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">① お問い合わせフォーム</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      不具合報告や、改善のご提案などはこちらのフォームから匿名で簡単にお送りいただけます。
                    </p>
                  </div>
                  <a
                    href="https://forms.gle/CQLUMaWPg55dwTLi8" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-center text-white font-bold rounded duration-200 block text-xs"
                  >
                    Googleフォームで連絡する
                  </a>
                </div>

                <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">② 開発者公式SNS (X)</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      ダイレクトメッセージ、リプライでお気軽にお声がけください。最新のアップデート情報も発信しています。
                    </p>
                  </div>
                  <a
                    href="https://x.com/ikasumi_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-center text-white font-bold rounded duration-200 block text-xs"
                  >
                    開発者X (DM/リプライ)
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
          <button 
            onClick={onBack}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            ゲームに戻る
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
