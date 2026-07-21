# nontechnical_korean — Failure Log

> 失敗するたびに1行。同じ失敗の再発防止用ゲートを追加し、ここに記録する。

| date | id | symptom | root cause | fix | gate added |
|---|---|---|---|---|---|
| 2026-06-17 | F1 | term JSON 19件で `Expecting ',' delimiter` (line 10 body_html) | エージェントがbody_htmlのHTML属性`class="..."`の二重引用符をJSON文字列内で未エスケープ | 再翻訳時にHTML属性へシングルクォート使用を強制 + `python3 -m json.tool` による自己検証ループ(VALIDになるまで書き直し) | terms_gate.sh (invalid-json検出) |
| 2026-06-17 | F2 | slop_gateで19件の誤検出(emoji=→、「그다음은」、「마법처럼」) | 絵文字の正規表現が矢印(U+2192)・dingbatを含み、メタ語「다음은」が「그다음은」にマッチ、demystify用の「魔法/놀라운/손쉽게」をhypeと誤判定 | 絵文字を本物の絵文字(U+1F000〜)に限定、一般的な「다음은/아래는」を除去、正常な述語を除外 | slop_gate.sh 補正 |
| 2026-07-21 | F3 | 日本語ローカライズ時、slop_gateのJapanese文字判定に使った文字クラス範囲がハングル(U+AC00–D7A3)と重なり、未翻訳の韓国語本文を誤ってPASS判定する恐れがあった | コピー&ペーストしたグリフ「豈」が意図したU+F900(CJK互換漢字)ではなくU+8C48(通常のCJK統合漢字)で、範囲が0x8C48-0xFAFFとなりハングル全域を包含していた | `\uXXXX`エスケープで明示的に範囲指定(ひらがな・カタカナ/CJK統合漢字/拡張A/互換漢字)し、ハングルを含まないことをテストで確認 | slop_gate.sh (jchar正規表現の範囲修正) |
