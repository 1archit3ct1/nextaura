const reveals = document.querySelectorAll(".section, .hero, .proof-card, .card, .demo-shell");

reveals.forEach((element) => element.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -5% 0px",
  }
);

reveals.forEach((element) => observer.observe(element));

const stepOrder = ["connect", "prereqs", "workflow", "roi", "ai", "scaffold"];

const providerCatalog = {
  slack: {
    name: "Slack",
    copy: "Support messages and internal operating rhythm.",
  },
  github: {
    name: "GitHub",
    copy: "PRs, repos, reviews, and release movement.",
  },
  google: {
    name: "Google",
    copy: "Sheets, Drive, and Gemini-adjacent workspace context.",
  },
  salesforce: {
    name: "Salesforce",
    copy: "Lead flow, account activity, and CRM orchestration.",
  },
};

const prereqCatalog = {
  aws: {
    name: "Cloud account",
    detail: "An AWS account with deploy permissions and billing enabled.",
    action: "Mark cloud ready",
  },
  domain: {
    name: "Domain and DNS",
    detail: "Own a domain and have access to DNS for webhook routing.",
    action: "Mark domain ready",
  },
  billing: {
    name: "Billing method",
    detail: "A card or billing method for paid API and cloud usage beyond free tiers.",
    action: "Mark billing ready",
  },
  mac: {
    name: "Mac build machine",
    detail: "Required for iOS and macOS signing and local build verification.",
    action: "Add Mac availability",
  },
  apple: {
    name: "Apple Developer account",
    detail: "Needed for iOS device deployment and production signing.",
    action: "Add Apple account",
  },
};

const workflowCatalog = {
  pr_summarizer: {
    name: "Daily PR Summarizer",
    short: "PR Summarizer",
    description: "Roll up repo activity into a clean operating brief for engineering teams.",
    requiresProviders: ["github"],
    requiresPrereqs: [],
    signal: "124 pull requests touched this month",
    roi: {
      weeklyHours: "6.5",
      monthlyValue: "$2,600",
      annualValue: "$31,200",
      confidence: 82,
      proof: "Review loops shrink when summaries land inside the team's existing flow.",
    },
    recommendedModel: "gpt41",
    files: [
      "app/workflows/pr_summarizer.ts",
      "providers/github.ts",
      "providers/slack.ts",
      "deploy/vercel.json",
    ],
    env: [
      "GITHUB_TOKEN reference",
      "SLACK_BOT_TOKEN reference",
      "OPENAI_API_KEY reference",
      "WORKFLOW_REPO_OWNER / WORKFLOW_REPO_NAME",
    ],
    notes: "Built for engineering teams that already live in GitHub and want a daily operating brief without more manual review churn.",
  },
  slack_support: {
    name: "Slack Support Agent",
    short: "Slack Support",
    description: "Triage support volume, surface intent, and draft responses inside Slack.",
    requiresProviders: ["slack"],
    requiresPrereqs: ["aws", "domain", "billing"],
    signal: "310 support messages per week",
    roi: {
      weeklyHours: "8.2",
      monthlyValue: "$3,450",
      annualValue: "$41,400",
      confidence: 88,
      proof: "Teams stop burning time on repeat replies and routing noise.",
    },
    recommendedModel: "gpt41",
    files: [
      "app/workflows/slack_support_agent.ts",
      "providers/slack.ts",
      "providers/openai.ts",
      "deploy/fargate-service.yaml",
    ],
    env: [
      "SLACK_BOT_TOKEN reference",
      "SLACK_SIGNING_SECRET reference",
      "OPENAI_API_KEY reference",
      "PUBLIC_WEBHOOK_URL / SUPPORT_CHANNEL_ID",
    ],
    notes: "This path stays locked until hosting, webhook routing, and billing are production-ready.",
  },
  salesforce_sync: {
    name: "Salesforce to Sheets Sync",
    short: "Salesforce Sync",
    description: "Move qualified CRM activity into operational spreadsheets and daily review loops.",
    requiresProviders: ["salesforce", "google"],
    requiresPrereqs: ["billing"],
    signal: "1,800 active leads in motion",
    roi: {
      weeklyHours: "5.1",
      monthlyValue: "$2,050",
      annualValue: "$24,600",
      confidence: 74,
      proof: "Back-office sync work becomes repeatable instead of manual export cleanup.",
    },
    recommendedModel: "gemini25",
    files: [
      "app/workflows/salesforce_sync.ts",
      "providers/salesforce.ts",
      "providers/google.ts",
      "deploy/scheduler.json",
    ],
    env: [
      "SALESFORCE_REFRESH_TOKEN reference",
      "GOOGLE_SHEETS_TOKEN reference",
      "SHEET_ID / SALESFORCE_REPORT_ID",
      "SYNC_SCHEDULE_CRON",
    ],
    notes: "Ideal for operators who already have CRM and reporting gravity but need dependable movement between them.",
  },
  ios_agent: {
    name: "On-device iOS Agent",
    short: "iOS Agent",
    description: "Ship a mobile-facing agent workflow once Apple readiness is actually in place.",
    requiresProviders: ["github"],
    requiresPrereqs: ["mac", "apple", "billing"],
    signal: "Mobile workflow candidate",
    roi: {
      weeklyHours: "9.4",
      monthlyValue: "$4,800",
      annualValue: "$57,600",
      confidence: 69,
      proof: "High upside, but only after the Apple path is truly production-ready.",
    },
    recommendedModel: "claude37",
    files: [
      "mobile/ios_agent/App.swift",
      "mobile/ios_agent/AgentRuntime.swift",
      "providers/openai.ts",
      "deploy/testflight.md",
    ],
    env: [
      "APPLE_TEAM_ID reference",
      "APP_STORE_CONNECT_KEY reference",
      "MODEL_PROVIDER_KEY reference",
      "RUNTIME_BUNDLE_ID",
    ],
    notes: "This remains intentionally locked until the Apple account and Mac hardware path are both ready.",
  },
};

const modelCatalog = {
  gpt41: {
    name: "GPT-4.1",
    provider: "OpenAI",
    detail: "Fast, dependable choice for support, ops, and engineering summaries.",
    availability: () => true,
  },
  claude37: {
    name: "Claude 3.7",
    provider: "Anthropic",
    detail: "Excellent for long context, but shown as pending until access is configured.",
    availability: () => false,
  },
  gemini25: {
    name: "Gemini 2.5",
    provider: "Google",
    detail: "Useful when the user's workflow is already inside the Google ecosystem.",
    availability: (state) => state.providers.google,
  },
};

const demoContent = {
  connect: {
    label: "Step 1",
    title: "Connect the tools already in use.",
    text: "Start with what is already real. The product should baseline an existing stack, not ask the user to pretend they have one.",
  },
  prereqs: {
    label: "Step 2",
    title: "Verify production prerequisites before promising anything serious.",
    text: "Missing accounts, hardware, or billing should become a clear roadmap instead of a late-stage surprise.",
  },
  workflow: {
    label: "Step 3",
    title: "Show only workflows the connected stack can actually support.",
    text: "Eligibility comes from provider connections, verified prerequisites, and what is truly ready today.",
  },
  roi: {
    label: "Step 4",
    title: "Translate readiness into visible return.",
    text: "Once a workflow is genuinely feasible, value should be concrete enough to feel undeniable.",
  },
  ai: {
    label: "Step 5",
    title: "Match the workflow to the model layer already within reach.",
    text: "Users should be nudged toward the strongest option they can actually use right now.",
  },
  scaffold: {
    label: "Step 6",
    title: "Return a scaffold that can move into implementation.",
    text: "The output should feel like a serious starting point with real files, contracts, and deployment direction.",
  },
};

function createInitialState() {
  return {
    currentStep: "connect",
    providers: {
      slack: true,
      github: true,
      google: true,
      salesforce: false,
    },
    prereqs: {
      aws: true,
      domain: true,
      billing: true,
      mac: false,
      apple: false,
    },
    workflow: "pr_summarizer",
    model: "gpt41",
  };
}

let demoState = createInitialState();

const demoTabs = document.querySelectorAll(".demo-tab");
const demoLabel = document.getElementById("demo-label");
const demoTitle = document.getElementById("demo-title");
const demoText = document.getElementById("demo-text");
const demoStage = document.getElementById("demo-stage");
const miniConnectedCount = document.getElementById("mini-connected-count");
const miniReadyCount = document.getElementById("mini-ready-count");
const miniModelChoice = document.getElementById("mini-model-choice");
const demoSummaryStatus = document.getElementById("demo-summary-status");
const demoSummaryWorkflow = document.getElementById("demo-summary-workflow");
const demoSummaryRoi = document.getElementById("demo-summary-roi");
const resetButton = document.getElementById("demo-reset");
const openScaffoldButton = document.getElementById("open-scaffold");
const demoDrawer = document.getElementById("demo-drawer");
const closeScaffoldButton = document.getElementById("close-scaffold");
const drawerTitle = document.getElementById("drawer-title");
const drawerFiles = document.getElementById("drawer-files");
const drawerEnv = document.getElementById("drawer-env");
const drawerNotes = document.getElementById("drawer-notes");

function countConnectedProviders(state) {
  return Object.values(state.providers).filter(Boolean).length;
}

function countReadyPrereqs(state) {
  return Object.values(state.prereqs).filter(Boolean).length;
}

function isWorkflowEligible(state, workflowKey) {
  const workflow = workflowCatalog[workflowKey];
  const providerReady = workflow.requiresProviders.every((providerKey) => state.providers[providerKey]);
  const prereqReady = workflow.requiresPrereqs.every((prereqKey) => state.prereqs[prereqKey]);
  return providerReady && prereqReady;
}

function getEligibleWorkflowKeys(state) {
  return Object.keys(workflowCatalog).filter((workflowKey) => isWorkflowEligible(state, workflowKey));
}

function getAvailableModelKeys(state) {
  return Object.keys(modelCatalog).filter((modelKey) => modelCatalog[modelKey].availability(state));
}

function coerceSelections() {
  const eligibleWorkflowKeys = getEligibleWorkflowKeys(demoState);
  if (!eligibleWorkflowKeys.includes(demoState.workflow)) {
    demoState.workflow = eligibleWorkflowKeys[0] || "pr_summarizer";
  }

  const availableModelKeys = getAvailableModelKeys(demoState);
  if (!availableModelKeys.includes(demoState.model)) {
    demoState.model = availableModelKeys[0] || "gpt41";
  }
}

function getCurrentWorkflow() {
  return workflowCatalog[demoState.workflow];
}

function getCurrentModel() {
  return modelCatalog[demoState.model];
}

function getStepIndex(stepKey) {
  return stepOrder.indexOf(stepKey);
}

function formatWorkflowRequirements(workflowKey) {
  const workflow = workflowCatalog[workflowKey];
  const requirements = [];

  workflow.requiresProviders.forEach((providerKey) => {
    requirements.push(providerCatalog[providerKey].name);
  });

  workflow.requiresPrereqs.forEach((prereqKey) => {
    requirements.push(prereqCatalog[prereqKey].name);
  });

  return requirements.length ? requirements.join(" + ") : "No extra gates";
}

function getSummaryStatus() {
  const connected = countConnectedProviders(demoState);
  const ready = countReadyPrereqs(demoState);
  const eligible = getEligibleWorkflowKeys(demoState).length;
  const currentStep = demoState.currentStep;

  if (currentStep === "connect") {
    return connected + " providers connected";
  }

  if (currentStep === "prereqs") {
    return ready + " of 5 prerequisites ready";
  }

  if (currentStep === "workflow") {
    return eligible + " workflows unlocked";
  }

  if (currentStep === "roi") {
    return "Value story in view";
  }

  if (currentStep === "ai") {
    return getCurrentModel().name + " selected";
  }

  return "Scaffold preview available";
}

function renderDrawer() {
  const workflow = getCurrentWorkflow();
  const model = getCurrentModel();

  drawerTitle.textContent = workflow.name + " Scaffold";
  drawerFiles.innerHTML = workflow.files.map((file) => "<li>" + file + "</li>").join("");
  drawerEnv.innerHTML = workflow.env
    .concat([model.provider.toUpperCase() + "_MODEL=" + model.name])
    .map((envItem) => "<li>" + envItem + "</li>")
    .join("");
  drawerNotes.textContent = workflow.notes + " Model layer currently shown: " + model.name + ".";
}

function openDrawer() {
  renderDrawer();
  demoDrawer.classList.add("is-open");
  demoDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  demoDrawer.classList.remove("is-open");
  demoDrawer.setAttribute("aria-hidden", "true");
}

function renderConnectStage() {
  const providerCards = Object.entries(providerCatalog)
    .map(([providerKey, provider]) => {
      const isConnected = demoState.providers[providerKey];
      return `
        <button class="provider-chip ${isConnected ? "is-on" : ""}" data-provider-toggle="${providerKey}" type="button">
          <span class="option-title">${provider.name}</span>
          <span class="option-meta">${provider.copy}</span>
          <span class="option-footer">
            <span class="option-status ${isConnected ? "is-positive" : "is-muted"}">${isConnected ? "Connected" : "Not connected"}</span>
            <span class="option-link">${isConnected ? "Disconnect" : "Connect"}</span>
          </span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="browser-body">
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Connected footprint</h4>
          <p>${countConnectedProviders(demoState)} of 4 providers are active in this demo state.</p>
        </div>
        <div class="demo-card">
          <h4>What changes next</h4>
          <p>Each connection narrows the workflow set and sharpens the ROI story that follows.</p>
        </div>
      </div>
      <div class="provider-grid">${providerCards}</div>
      <div class="stage-actions">
        <span class="stage-note">Tip: connect Salesforce if you want the CRM workflow to unlock later.</span>
        <button class="button button-primary button-inline" data-nav-step="prereqs" type="button">Continue to prerequisites</button>
      </div>
    </div>
  `;
}

function renderPrereqStage() {
  const checklist = Object.entries(prereqCatalog)
    .map(([prereqKey, prereq]) => {
      const isReady = demoState.prereqs[prereqKey];
      return `
        <button class="check-item ${isReady ? "is-ready" : "is-blocked"}" data-prereq-toggle="${prereqKey}" type="button">
          <span class="option-title">${prereq.name}</span>
          <span class="option-meta">${prereq.detail}</span>
          <span class="option-footer">
            <span class="option-status ${isReady ? "is-positive" : "is-warning"}">${isReady ? "Ready" : "Missing"}</span>
            <span class="option-link">${isReady ? "Mark missing" : prereq.action}</span>
          </span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="browser-body">
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Production gate</h4>
          <p>Web paths can move with cloud, DNS, and billing. Apple paths stay blocked until the hardware and account are real.</p>
        </div>
        <div class="demo-card">
          <h4>Returning users</h4>
          <p>Status persists so people can leave, gather what is missing, and come back to the same readiness state.</p>
        </div>
      </div>
      <div class="check-grid">${checklist}</div>
      <div class="stage-actions">
        <button class="button button-secondary button-inline" data-nav-step="connect" type="button">Back</button>
        <button class="button button-primary button-inline" data-nav-step="workflow" type="button">See eligible workflows</button>
      </div>
    </div>
  `;
}

function renderWorkflowStage() {
  const workflowCards = Object.keys(workflowCatalog)
    .map((workflowKey) => {
      const workflow = workflowCatalog[workflowKey];
      const isEligible = isWorkflowEligible(demoState, workflowKey);
      const isSelected = demoState.workflow === workflowKey;
      return `
        <button class="workflow-option ${isSelected ? "is-selected" : ""}" data-workflow-select="${workflowKey}" type="button" ${isEligible ? "" : "disabled"}>
          <span class="option-title">${workflow.name}</span>
          <span class="option-meta">${workflow.description}</span>
          <span class="option-meta option-meta-soft">Requires ${formatWorkflowRequirements(workflowKey)}</span>
          <span class="option-footer">
            <span class="option-status ${isEligible ? "is-positive" : "is-warning"}">${isEligible ? "Unlocked" : "Locked"}</span>
            <span class="option-link">${isEligible ? workflow.signal : "Resolve requirements first"}</span>
          </span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="browser-body">
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Deterministic catalog</h4>
          <p>Only feasible workflows should feel selectable. Locked options stay visible so the user understands what is missing.</p>
        </div>
        <div class="demo-card">
          <h4>Current unlock count</h4>
          <p>${getEligibleWorkflowKeys(demoState).length} workflows are currently available in this walkthrough.</p>
        </div>
      </div>
      <div class="workflow-grid">${workflowCards}</div>
      <div class="stage-actions">
        <button class="button button-secondary button-inline" data-nav-step="prereqs" type="button">Back</button>
        <button class="button button-primary button-inline" data-nav-step="roi" type="button">View ROI story</button>
      </div>
    </div>
  `;
}

function renderRoiStage() {
  const workflow = getCurrentWorkflow();
  return `
    <div class="browser-body">
      <div class="roi-grid">
        <div class="roi-figure">
          <span>Weekly time saved</span>
          <strong>${workflow.roi.weeklyHours} hours</strong>
          <p class="option-meta">${workflow.signal}</p>
        </div>
        <div class="roi-figure">
          <span>Projected monthly value</span>
          <strong>${workflow.roi.monthlyValue}</strong>
          <p class="option-meta">${workflow.roi.proof}</p>
        </div>
      </div>
      <div class="roi-meter">
        <span class="proof-label">Confidence meter</span>
        <div class="meter-track">
          <div class="meter-fill" id="roi-meter-fill" data-width="${workflow.roi.confidence}"></div>
        </div>
        <div class="meter-caption">${workflow.roi.confidence}% confidence based on the current stack and workflow fit.</div>
      </div>
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Annualized upside</h4>
          <p>${workflow.roi.annualValue} equivalent throughput if the workflow becomes part of the team's weekly rhythm.</p>
        </div>
        <div class="demo-card">
          <h4>Reason this lands</h4>
          <p>The story is stronger because it extends the user's current stack instead of demanding a migration.</p>
        </div>
      </div>
      <div class="stage-actions">
        <button class="button button-secondary button-inline" data-nav-step="workflow" type="button">Back</button>
        <button class="button button-primary button-inline" data-nav-step="ai" type="button">Choose the model</button>
      </div>
    </div>
  `;
}

function renderAiStage() {
  const recommendedModel = getCurrentWorkflow().recommendedModel;
  const modelCards = Object.entries(modelCatalog)
    .map(([modelKey, model]) => {
      const isAvailable = model.availability(demoState);
      const isSelected = demoState.model === modelKey;
      const isRecommended = modelKey === recommendedModel;
      return `
        <button class="model-option ${isSelected ? "is-selected" : ""}" data-model-select="${modelKey}" type="button" ${isAvailable ? "" : "disabled"}>
          <span class="option-title">${model.name}</span>
          <span class="option-meta">${model.provider}</span>
          <span class="option-meta option-meta-soft">${model.detail}</span>
          <span class="option-footer">
            <span class="option-status ${isAvailable ? "is-positive" : "is-muted"}">${isAvailable ? "Available" : "Pending access"}</span>
            <span class="option-link">${isRecommended ? "Recommended for this workflow" : "Alternative option"}</span>
          </span>
        </button>
      `;
    })
    .join("");

  return `
    <div class="browser-body">
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Current recommendation</h4>
          <p>${modelCatalog[recommendedModel].name} is the strongest match for ${getCurrentWorkflow().short.toLowerCase()} in this demo state.</p>
        </div>
        <div class="demo-card">
          <h4>Entitlement discipline</h4>
          <p>Unavailable models stay visible but locked until the account, access, or billing path exists.</p>
        </div>
      </div>
      <div class="model-grid">${modelCards}</div>
      <div class="stage-actions">
        <button class="button button-secondary button-inline" data-nav-step="roi" type="button">Back</button>
        <button class="button button-primary button-inline" data-nav-step="scaffold" type="button">Generate scaffold view</button>
      </div>
    </div>
  `;
}

function renderScaffoldStage() {
  const workflow = getCurrentWorkflow();
  const model = getCurrentModel();
  return `
    <div class="browser-body">
      <div class="scaffold-summary">
        <div class="file-stack">
          <span class="proof-label">Included files</span>
          ${workflow.files.map((file) => "<code>" + file + "</code>").join("")}
        </div>
        <div class="scaffold-card">
          <span class="proof-label">Runtime contract</span>
          <p class="option-meta">Selected workflow: ${workflow.name}</p>
          <p class="option-meta">Selected model: ${model.name}</p>
          <p class="option-meta">Token references stay outside source and are injected at runtime.</p>
          <div class="scaffold-cta-row">
            <button class="button button-primary button-inline" id="stage-open-scaffold" type="button">Open full preview</button>
            <a class="button button-secondary button-inline" href="#contact">Request a walkthrough</a>
          </div>
        </div>
      </div>
      <div class="demo-control-grid">
        <div class="demo-card">
          <h4>Deployment direction</h4>
          <p>Output should include runtime files, environment references, and the next clear deployment step.</p>
        </div>
        <div class="demo-card">
          <h4>What makes this credible</h4>
          <p>The scaffold appears only after the user has already moved through connection, readiness, workflow, ROI, and model choice.</p>
        </div>
      </div>
      <div class="stage-actions">
        <button class="button button-secondary button-inline" data-nav-step="ai" type="button">Back</button>
        <button class="button button-primary button-inline" data-nav-step="connect" type="button">Restart journey</button>
      </div>
    </div>
  `;
}

function renderStage() {
  if (demoState.currentStep === "connect") {
    return renderConnectStage();
  }

  if (demoState.currentStep === "prereqs") {
    return renderPrereqStage();
  }

  if (demoState.currentStep === "workflow") {
    return renderWorkflowStage();
  }

  if (demoState.currentStep === "roi") {
    return renderRoiStage();
  }

  if (demoState.currentStep === "ai") {
    return renderAiStage();
  }

  return renderScaffoldStage();
}

function bindStageActions() {
  document.querySelectorAll("[data-provider-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const providerKey = button.dataset.providerToggle;
      demoState.providers[providerKey] = !demoState.providers[providerKey];
      coerceSelections();
      renderDemo();
    });
  });

  document.querySelectorAll("[data-prereq-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const prereqKey = button.dataset.prereqToggle;
      demoState.prereqs[prereqKey] = !demoState.prereqs[prereqKey];
      coerceSelections();
      renderDemo();
    });
  });

  document.querySelectorAll("[data-workflow-select]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }

      demoState.workflow = button.dataset.workflowSelect;
      renderDemo();
    });
  });

  document.querySelectorAll("[data-model-select]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }

      demoState.model = button.dataset.modelSelect;
      renderDemo();
    });
  });

  document.querySelectorAll("[data-nav-step]").forEach((button) => {
    button.addEventListener("click", () => {
      demoState.currentStep = button.dataset.navStep;
      renderDemo();
    });
  });

  const stageOpenScaffold = document.getElementById("stage-open-scaffold");
  if (stageOpenScaffold) {
    stageOpenScaffold.addEventListener("click", openDrawer);
  }
}

function animateMeter() {
  const meterFill = document.getElementById("roi-meter-fill");
  if (!meterFill) {
    return;
  }

  window.requestAnimationFrame(() => {
    meterFill.style.width = meterFill.dataset.width + "%";
  });
}

function renderDemo() {
  coerceSelections();

  const step = demoContent[demoState.currentStep];
  const currentWorkflow = getCurrentWorkflow();
  const currentModel = getCurrentModel();
  const currentStepIndex = getStepIndex(demoState.currentStep);

  demoTabs.forEach((tab) => {
    const tabStep = tab.dataset.step;
    const tabIndex = getStepIndex(tabStep);
    const isActive = tabStep === demoState.currentStep;
    tab.classList.toggle("is-active", isActive);
    tab.classList.toggle("is-complete", tabIndex < currentStepIndex);
    tab.setAttribute("aria-selected", String(isActive));
  });

  demoLabel.textContent = step.label;
  demoTitle.textContent = step.title;
  demoText.textContent = step.text;
  demoStage.innerHTML = renderStage();

  miniConnectedCount.textContent = String(countConnectedProviders(demoState));
  miniReadyCount.textContent = countReadyPrereqs(demoState) + " / 5";
  miniModelChoice.textContent = currentModel.name;
  demoSummaryStatus.textContent = getSummaryStatus();
  demoSummaryWorkflow.textContent = currentWorkflow.short;
  demoSummaryRoi.textContent = currentWorkflow.roi.monthlyValue;

  bindStageActions();
  animateMeter();
  renderDrawer();
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    demoState.currentStep = tab.dataset.step;
    renderDemo();
  });
});

resetButton.addEventListener("click", () => {
  demoState = createInitialState();
  closeDrawer();
  renderDemo();
});

openScaffoldButton.addEventListener("click", openDrawer);
closeScaffoldButton.addEventListener("click", closeDrawer);

demoDrawer.addEventListener("click", (event) => {
  if (event.target === demoDrawer) {
    closeDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

const copyButtons = document.querySelectorAll("[data-copy-target]");
const fundingdashDemoLink = document.getElementById("fundingdash-demo-link");
const fundingdashStatus = document.getElementById("fundingdash-status");
const fundingdashReadiness = document.getElementById("fundingdash-readiness");

async function hydrateFundingdashLink() {
  if (!fundingdashDemoLink || !fundingdashStatus || !fundingdashReadiness) {
    return;
  }

  const metadataUrl =
    "https://raw.githubusercontent.com/1archit3ct1/fundingdash/main/metadata.json";
  const taskStatusUrl =
    "https://raw.githubusercontent.com/1archit3ct1/fundingdash/main/task_status.json";

  try {
    const [metadataResponse, taskStatusResponse] = await Promise.all([
      fetch(metadataUrl, { cache: "no-store" }),
      fetch(taskStatusUrl, { cache: "no-store" }),
    ]);

    if (!metadataResponse.ok) {
      return;
    }

    const metadata = await metadataResponse.json();
    const publicDemoUrl =
      metadata && typeof metadata.publicDemoUrl === "string"
        ? metadata.publicDemoUrl.trim()
        : "";

    if (!publicDemoUrl) {
      return;
    }

    fundingdashDemoLink.href = publicDemoUrl;
    fundingdashDemoLink.textContent = "Open Live Demo";
    fundingdashStatus.textContent = "Live demo linked";
    fundingdashStatus.classList.add("is-live");

    if (!taskStatusResponse.ok) {
      return;
    }

    const taskStatus = await taskStatusResponse.json();
    const steps = taskStatus && typeof taskStatus === "object" ? taskStatus.steps : null;
    const allGreen =
      steps &&
      Object.values(steps).every(
        (step) => step && typeof step === "object" && step.overall === "green"
      );

    fundingdashReadiness.textContent = allGreen ? "Launch-ready" : "Readiness in progress";
    fundingdashReadiness.classList.add(allGreen ? "is-ready" : "is-progress");
  } catch {
    // Keep defaults if metadata is unavailable.
  }
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) {
      return;
    }

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const originalText = button.textContent;
      button.textContent = "Copied";
      button.classList.add("is-copied");

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("is-copied");
      }, 1400);
    } catch {
      button.textContent = "Copy failed";
    }
  });
});

renderDemo();
hydrateFundingdashLink();
