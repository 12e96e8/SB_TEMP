// Automation palette is a front-end interaction prototype, not an execution engine.
const automationDefinitions = [
  {
    group: "觸發器 Trigger",
    items: [
      ["trigger", "▶", "手動觸發", "點擊執行開始流程"],
      ["webhook", "⌁", "Webhook", "收到外部 HTTP 請求時啟動"],
      ["schedule", "◷", "排程觸發", "依時間啟動"],
    ],
  },
  {
    group: "API 與資料存取",
    items: [
      ["http-get", "⇩", "HTTP GET", "向外部 API 取得資料"],
      ["http-post", "⇧", "HTTP POST", "向外部 API 傳送 JSON"],
    ],
  },
  {
    group: "條件與資料處理",
    items: [
      ["filter", "◇", "Filter 篩選", "符合條件的資料繼續"],
      ["if", "⑂", "IF 條件判斷", "依 True / False 分流"],
      ["switch", "⑃", "Switch 多分支", "依條件分成多條路徑"],
      ["set", "✎", "Edit Fields", "設定或轉換欄位"],
    ],
  },
  {
    group: "控制與輸出",
    items: [
      ["delay", "◴", "Wait 等待", "延遲下一個步驟"],
      ["response", "✓", "回傳結果", "顯示或回傳處理結果"],
    ],
  },
];
const automationConfig = {
  trigger: [["workflowName", "流程名稱", "工作流程 A"]],
  webhook: [["path", "Webhook 路徑", "/syncboard/event"]],
  schedule: [["cron", "排程規則", "每天 09:00"]],
  "http-get": [
    ["method", "Method", "GET"],
    ["url", "URL", "https://api.example.com/users"],
    ["headers", "Headers (JSON)", "{}"],
  ],
  "http-post": [
    ["method", "Method", "POST"],
    ["url", "URL", "https://api.example.com/submit"],
    ["body", "Body (JSON)", '{"name":"Amy"}'],
  ],
  filter: [
    ["field", "欄位", "age"],
    ["operator", "運算子", ">="],
    ["value", "比較值", "18"],
  ],
  if: [
    ["field", "判斷欄位", "status"],
    ["operator", "運算子", "=="],
    ["value", "比較值", "active"],
  ],
  switch: [
    ["field", "分支依據", "category"],
    ["branches", "分支", "A, B, other"],
  ],
  set: [
    ["field", "目標欄位", "fullName"],
    ["value", "設定值", "Amy"],
  ],
  delay: [["seconds", "等待秒數", "5"]],
  response: [["format", "結果格式", "JSON"]],
};
const autoStyle = document.createElement("style");
autoStyle.textContent = `
.tool.auto-highlight{background:#e6ebff;color:#3158d9;font-weight:800}
.auto-drawer{position:absolute;z-index:7;left:12px;top:15px;bottom:90px;width:304px;max-width:calc(100% - 20px);background:white;border:1px solid #dce3f0;border-radius:17px;box-shadow:0 18px 55px #25395f32;display:none;flex-direction:column;overflow:hidden}
.auto-drawer.open{display:flex}.auto-head{padding:17px 18px;border-bottom:1px solid #e8edf6;display:flex;justify-content:space-between;align-items:center}.auto-head strong{font-size:16px}.auto-head button{background:#f0f3f9;border:none;border-radius:8px;width:30px;height:30px;font-size:18px}.auto-content{overflow:auto;padding:13px}.auto-group-title{font-size:12px;font-weight:800;color:#8795ad;margin:18px 3px 10px}.auto-item{display:flex;gap:12px;align-items:center;width:100%;padding:12px 10px;text-align:left;border:1px solid #e7ebf3;border-radius:11px;background:white;margin-bottom:8px}.auto-item:hover{border-color:#8ba3fc;background:#f4f7ff}.auto-symbol{width:38px;height:38px;flex:none;background:#e7eeff;color:#3b5bcc;display:grid;place-items:center;border-radius:10px;font-size:22px}.auto-item strong{display:block;font-size:13px;color:#263656}.auto-item small{display:block;font-size:11px;line-height:1.5;color:#8290a5;margin-top:3px}.auto-node-config{border-top:1px solid #e9edf5;padding:16px 22px}.auto-node-config h3{margin:0 0 9px;font-size:13px}.auto-config-tip{background:#edf4ff;color:#536eaa;border-radius:8px;font-size:11px;line-height:1.6;padding:10px;margin-top:10px}
`;
document.head.appendChild(autoStyle);
const autoButton = document.createElement("button");
autoButton.className = "tool auto-highlight";
autoButton.innerHTML = "<span>⚡</span>自動化";
document.querySelector('[data-add="node"]').replaceWith(autoButton);
const drawer = document.createElement("div");
drawer.className = "auto-drawer";
drawer.setAttribute("aria-label", "自動化節點庫");
drawer.innerHTML =
  '<div class="auto-head"><strong>⚡ 自動化元件庫</strong><button id="closeAutomation" aria-label="關閉">×</button></div><div class="auto-content"><p class="hint">點擊元件加入白板。不同工作流程的執行與節點連線，將在後端整合階段實作。</p>' +
  automationDefinitions
    .map(
      (g) =>
        '<div class="auto-group-title">' +
        g.group +
        "</div>" +
        g.items
          .map(
            (i) =>
              '<button class="auto-item" data-auto="' +
              i[0] +
              '"><span class="auto-symbol">' +
              i[1] +
              "</span><span><strong>" +
              i[2] +
              "</strong><small>" +
              i[3] +
              "</small></span></button>",
          )
          .join(""),
    )
    .join("") +
  "</div>";
document.getElementById("stageWrap").appendChild(drawer);
autoButton.addEventListener("click", () => drawer.classList.toggle("open"));
drawer.querySelector("#closeAutomation").onclick = () =>
  drawer.classList.remove("open");
drawer.querySelectorAll("[data-auto]").forEach((button) =>
  button.addEventListener("click", () => {
    const type = button.dataset.auto;
    add("node");
    const node = find();
    const item = automationDefinitions
      .flatMap((g) => g.items)
      .find((i) => i[0] === type);
    node.nodeKind = type;
    node.text = item[2];
    node.settings = Object.fromEntries(
      (automationConfig[type] || []).map((c) => [c[0], c[2]]),
    );
    node.w = 190;
    node.h = 115;
    drawer.classList.remove("open");
    render();
    properties();
    notify("已新增 " + item[2] + " 節點");
  }),
);
const originalProperties = properties;
properties = function () {
  originalProperties();
  const node = find();
  if (!node || node.type !== "node") return;
  const kind =
    node.nodeKind ||
    (node.text.includes("GET")
      ? "http-get"
      : node.text.includes("Filter")
        ? "filter"
        : "trigger");
  const schema = automationConfig[kind] || [];
  node.settings ||= Object.fromEntries(schema.map((f) => [f[0], f[2]]));
  const container = document.createElement("section");
  container.className = "auto-node-config";
  const heading = document.createElement("h3");
  heading.textContent = "⚡ 自動化節點參數";
  container.appendChild(heading);
  schema.forEach((field) => {
    const label = document.createElement("label");
    label.className = "fieldLabel";
    label.textContent = field[1];
    const input = document.createElement("input");
    input.className = "field";
    input.value = node.settings[field[0]] || "";
    input.addEventListener("change", () => {
      commit();
      node.settings[field[0]] = input.value;
      notify("節點設定已修改（僅預覽）");
    });
    container.append(label, input);
  });
  const tip = document.createElement("p");
  tip.className = "auto-config-tip";
  tip.textContent =
    "此處可設定節點參數；目前僅保存於瀏覽器記憶體，不會呼叫外部 API 或執行工作流程。";
  container.appendChild(tip);
  panel.appendChild(container);
};
properties();
