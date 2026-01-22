import { AiSettings, DisplaySettings, UserMode } from './types';

export const defaultAiSettings: AiSettings = { perspective: 'third_person_limited', length: 700, tone: '', creativity: '普通', knowledgeAdherence: '普通', suggestionFrequency: '普通', memoryScope: 'summary', assistantPersona: 'polite', markdownFrequency: 'しない', showSpeakerInDialogue: false, writingStyleMimicry: true, generateMultipleContinuations: false, applySpeakerColorToDialogue: false };
export const defaultDisplaySettings: DisplaySettings = { theme: 'light', fontFamily: 'sans', fontSize: 17, swapSidebars: false };

export const FONT_MAP = {
    'sans': "'Noto Sans JP', sans-serif",
    'serif': "'Noto Serif JP', serif",
    'rounded-sans': "'M PLUS Rounded 1c', sans-serif",
    'handwriting': "'Yuji Syuku', cursive",
    'sawarabi-serif': "'Sawarabi Mincho', serif"
};

// ユーザーモードに応じたツールチップ情報
export const TOOLTIP_MESSAGES: Record<string, Record<UserMode, { title: string; desc: string; shortcut?: string; tech?: string }>> = {
    bold: {
        simple: { title: '太字', desc: '文字を太くして目立たせます。大事なところに使いましょう。' },
        standard: { title: '太字にする', desc: '選択した文字を強調します。', shortcut: 'B' },
        pro: { title: '太字タグ (**)', desc: 'Markdown記法の強調(strong)タグを挿入します。', shortcut: 'B', tech: '構文: **テキスト**' }
    },
    underline: {
        simple: { title: '下線', desc: '文字の下に線を引いて目立たせます。' },
        standard: { title: '下線を引く', desc: '重要な箇所にアンダーラインを引きます。', shortcut: 'U' },
        pro: { title: '下線タグ (__)', desc: 'Markdown記法の下線タグを挿入します。', shortcut: 'U', tech: '構文: __テキスト__' }
    },
    heading: {
        simple: { title: '見出し', desc: '文字を大きくして、新しい章のタイトルにします。' },
        standard: { title: '見出しにする', desc: '章や節のタイトルを作成します。', shortcut: 'H' },
        pro: { title: '見出しタグ (#)', desc: '行頭にH1ヘッダー記号を挿入します。', shortcut: 'H', tech: '構文: # タイトル' }
    },
    ruby: {
        simple: { title: 'ふりがな', desc: '漢字の上に読みがなをつけます。' },
        standard: { title: 'ルビを振る', desc: '選択した文字にふりがなを設定します。', shortcut: 'R' },
        pro: { title: 'ルビ構文', desc: '独自拡張のルビ記法を挿入します。', shortcut: 'R', tech: '構文: {漢字|よみ}' }
    },
    palette: {
        simple: { title: '色をぬる', desc: '選んでいる色を文字につけます。セリフを飾るのに便利！' },
        standard: { title: '文字色を変更', desc: '選択したテキストに色を塗ります。', shortcut: 'Shift+C' },
        pro: { title: 'カラータグ (<c:>)', desc: '独自拡張タグでインラインスタイルを適用します。', shortcut: 'Shift+C', tech: '構文: <c:#hex>...</c>' }
    },
    palette_select: {
        simple: { title: '色をえらぶ', desc: '文字につける色を変更します。' },
        standard: { title: 'パレットを開く', desc: '文字色の選択パネルを表示します。' },
        pro: { title: 'カラーピッカー', desc: 'HEX値やプリセットから色を選択します。', tech: '内部値: HEX / RGBA' }
    }
};

export const helpContent = {
    // ...existing content
    assistantPersona: {
        title: "AIアシスタントの口調",
        description: "相談モードの時のAIの話し方（ペルソナ）を設定します。あなたの気分や相談内容に合わせて、AIの性格を切り替えることができます。",
        sections: [
            { heading: "丁寧な編集者", body: "「〜です」「〜ます」を基本とした、礼儀正しく的確なアドバイスをくれるパートナーです。", example: "「その設定は素晴らしいですね。物語の深みを増すために、彼の過去にもう一つエピソードを加えてみてはいかがでしょうか？」", useCase: "プロットの矛盾点チェックや、客観的な意見が欲しい時におすすめです。" },
            { heading: "親しい友人", body: "「〜だね！」「〜だよ」といった、親しい友人のようにフランクにアイデア出しを手伝ってくれます。", example: "「めっちゃいいね！そのキャラ、絶対人気出るよ！次はどんな活躍させようか？」", useCase: "行き詰まった時に、気軽に壁打ち相手が欲しい時や、モチベーションを上げたい時に。" },
            { heading: "分析的な批評家", body: "物語の構造や設定の甘さを冷静に、かつ論理的に指摘してくれます。厳しいですが、作品のクオリティ向上に大きく貢献します。", example: "「その展開は感情的ですが、伏線が不足しているため読者には唐突に映る危険性があります。Aの出来事との関連性をより明確に描写すべきです。」", useCase: "推敲の段階や、より完成度の高い物語を目指したい時に最適です。" },
            { heading: "創造的な詩人", body: "詩的で、常識にとらわれれないアーティスティックな提案をしてくれます。発想の飛躍を促します。", example: "「彼の悲しみを、ただ涙で表現するのではなく、『街から色が失われた』といった比喩で描いてみては？世界が彼の心象風景を映す鏡となるのです。」", useCase: "斬新な表現や、アーティスティックなインスピレーションが欲しい時に。" },
            { heading: "熱狂的なファン", body: "あなたのアイデアを全面的に肯定し、とにかく褒めてくれます。創作の楽しさを再確認させてくれる存在です。", example: "「最高です！先生！そのアイデアは天才のそれですよ！早く続きが読みたいです！読者を代表して言わせてください、あなたは神です！」", useCase: "とにかくモチベーションが欲しい時、自分を信じられなくなった時に。" }
        ]
    },
};