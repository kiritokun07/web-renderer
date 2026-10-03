export const example = {
  html: `<main class="card">
  <span class="tag">A LITTLE EXPERIMENT</span>
  <div class="plant" aria-hidden="true">✳</div>
  <h1>让想法，慢慢生长。</h1>
  <p>每一个有趣的网页，<br>都从第一行代码开始。</p>
  <button id="grow">种下一点灵感 <span>↗</span></button>
  <div id="message" aria-live="polite">今天也是创造的好日子。</div>
</main>`,
  css: `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f3f5ed;
  color: #364c36;
  font-family: system-ui, sans-serif;
}
.card { text-align: center; }
.tag {
  font-size: 8px;
  letter-spacing: 2.5px;
  color: #96a089;
}
.plant {
  width: 98px;
  height: 98px;
  margin: 35px auto 26px;
  border: 1px solid #d4dfc9;
  border-radius: 50%;
  background: #e8eddf;
  color: #6d8c55;
  font-size: 69px;
  line-height: 96px;
}
h1 {
  margin: 0 0 15px;
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -1px;
}
p {
  color: #8a967d;
  font-size: 12px;
  line-height: 2;
  margin: 0 0 28px;
}
button {
  border: 0;
  border-radius: 6px;
  background: #426c42;
  color: white;
  padding: 12px 21px;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
button:hover { background: #345934; }
button span { margin-left: 16px; }
#message {
  margin-top: 20px;
  color: #a0aa92;
  font-size: 9px;
}`,
  js: `const button = document.querySelector('#grow');
const message = document.querySelector('#message');
let ideas = 0;

button.addEventListener('click', () => {
  ideas += 1;
  message.textContent = '已种下 ' + ideas + ' 个灵感，继续生长吧。';
});`,
};
