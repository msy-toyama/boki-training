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
        <div className="flex border-b border-slate-700 bg-slate-800/30 flex-shrink-0 overflow-x-auto text-xs md:text-sm" role="tablist" aria-label="インフォメーションのカテゴリ">
          <button
            onClick={() => setActiveTab('about')}
            role="tab"
            id="info-tab-about"
            aria-selected={activeTab === 'about'}
            aria-controls="info-panel-about"
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
            role="tab"
            id="info-tab-terms"
            aria-selected={activeTab === 'terms'}
            aria-controls="info-panel-terms"
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
            role="tab"
            id="info-tab-privacy"
            aria-selected={activeTab === 'privacy'}
            aria-controls="info-panel-privacy"
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
            role="tab"
            id="info-tab-contact"
            aria-selected={activeTab === 'contact'}
            aria-controls="info-panel-contact"
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
            <div className="space-y-6 animate-in fade-in duration-200" role="tabpanel" id="info-panel-about" aria-labelledby="info-tab-about">
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
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">本アプリの学習体験へのこだわり</h2>
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
            <div className="space-y-6 animate-in fade-in duration-200" role="tabpanel" id="info-panel-terms" aria-labelledby="info-tab-terms">
              <p className="text-xs text-slate-500">制定日: 2024年11月21日 / 改訂日: 2026年5月25日</p>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第1条（規約の適用）</h2>
                <p>
                  本利用規約（以下、「本規約」）は、Toyama Digital Works（以下、「当方」）がWeb上で提供する「簿記トレーニング大戦」および関連するナレッジベース（以下、「本サイト」）の利用条件を定めるものです。
                  ユーザーは、本サイトを利用することにより本規約に同意したものとみなされます。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第2条（サービスの内容）</h2>
                <p>
                  本サイトは、日商簿記3級を中心とした学習支援コンテンツ、問題演習、プレイ履歴保存、学習コラムを提供します。
                  本サイトは無料で利用できますが、広告配信サービスによる広告が表示される場合があります。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第3条（禁止事項）</h2>
                <p>ユーザーは、本サイトの利用にあたり、以下の行為を行ってはなりません。</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                  <li>本サイトのサーバーやネットワークに過度な負担をかける行為</li>
                  <li>自動化スクリプト等によりスコアや履歴を不正に改ざんする行為</li>
                  <li>本サイトのコンテンツを無断で複製、転載、再配布する行為</li>
                  <li>第三者の権利、プライバシー、知的財産権を侵害する行為</li>
                  <li>法令または公序良俗に反する行為</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第4条（免責事項）</h2>
                <p>
                  本サイトの問題、解説、学習計画、計算結果等は、学習支援を目的として作成されています。内容の正確性、完全性、最新性、有用性について細心の注意を払っていますが、これらを保証するものではありません。
                </p>
                <div className="flex gap-2 bg-slate-800 p-3 rounded border border-amber-900/40 text-amber-300 text-xs">
                  <AlertTriangle className="flex-shrink-0" size={16} />
                  <p>本サイトの利用または利用不能により生じた損害、学習成果、試験結果、データ消失、通信費等について、運営者は法令上認められる範囲で責任を負いません。</p>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第5条（知的財産権）</h2>
                <p>
                  本サイトに掲載される文章、問題、解説、UI、画像、プログラム等の権利は、運営者または正当な権利者に帰属します。
                  個人の学習目的での閲覧や利用を除き、無断転載、複製、改変、再配布を禁止します。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第6条（サービスの変更・停止）</h2>
                <p>
                  運営者は、保守、障害対応、内容改善、仕様変更等のため、事前の通知なく本サイトの全部または一部を変更、停止、終了することがあります。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">第7条（準拠法・管轄）</h2>
                <p>
                  本規約は日本法に準拠します。本サイトに関して紛争が生じた場合は、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200" role="tabpanel" id="info-panel-privacy" aria-labelledby="info-tab-privacy">
              <p className="text-xs text-slate-500">制定日: 2024年11月21日 / 改訂日: 2026年5月25日</p>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">1. 収集する情報</h2>
                <p>
                  簿記トレーニング大戦（以下、「本サイト」）では、学習体験の保存、プレイ履歴の表示、サービス改善、不具合確認のために、以下の情報を取得またはブラウザ内に保存することがあります。
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                  <li>スコア、正解数、難易度、プレイ日時などの学習履歴</li>
                  <li>サウンド設定、表示設定などのアプリ利用設定</li>
                  <li>ランキングや履歴表示のためにユーザーが任意で入力したニックネーム等</li>
                  <li>アクセス解析により取得されるブラウザ、端末、アクセス日時、参照元などの匿名情報</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">2. ローカルストレージの利用</h2>
                <p>
                  本サイトは、スコア履歴やサウンド設定をユーザーのブラウザ内に保存するため、localStorage等のブラウザ保存領域を使用します。
                  これらの情報は原則としてユーザーの端末内に保存され、ブラウザの設定や履歴削除操作によって削除できます。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">3. 広告配信サービスについて</h2>
                <p>
                  当サイトでは、第三者配信事業者であるGoogle社が提供する広告配信サービス「Google AdSense」を利用して広告を表示することがあります。
                  Googleなどの広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
                  Cookieを使用することで、当サイトや他サイトへの過去のアクセス情報に基づいて広告が配信されます。
                </p>
                <p>
                  ユーザーは、
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Googleの広告設定ページ</a>
                  でパーソナライズ広告を無効にできます。また、第三者配信事業者のCookie利用については、
                  <a href="https://aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">aboutads.info</a>
                  から無効化できる場合があります。GoogleによるCookie等の利用に関する詳細は、
                  <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Googleの広告に関するポリシー</a>
                  をご確認ください。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">4. アクセス解析について</h2>
                <p>
                  本サイトでは、アクセス状況の把握とサービス改善のために、Google Analytics等のアクセス解析ツールを利用する場合があります。
                  これらのツールはCookieを使用して匿名の利用状況データを収集することがありますが、個人を特定する情報は含まれません。
                </p>
                <div className="mt-2 flex flex-col gap-1 text-indigo-400 text-xs pl-1">
                  <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" className="hover:underline">● Google Analytics 利用規約</a>
                  <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer" className="hover:underline">● Google プライバシーポリシー</a>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">5. 個人情報の第三者提供</h2>
                <p>
                  当サイトが取得した情報は、法令に基づく開示請求がある場合を除き、本人の同意なく第三者に販売または提供することはありません。
                  広告配信、アクセス解析、問い合わせフォームなど外部サービスを利用する場合は、それぞれの事業者のプライバシーポリシーが適用されます。
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base md:text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">6. お問い合わせ</h2>
                <p>
                  本ポリシーに関するお問い合わせは、上部タブの「お問い合わせ」からご連絡ください。
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-200" role="tabpanel" id="info-panel-contact" aria-labelledby="info-tab-contact">
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
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0 space-y-3">
          <button 
            onClick={onBack}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            ゲームに戻る
          </button>
          <p className="text-center text-xs text-slate-500">© 2026 簿記トレーニング大戦. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
