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

const demoSteps = {
  connect: {
    label: "Step 1",
    title: "Connect the tools already in use.",
    text: "Slack, GitHub, Google, and Salesforce form the baseline. The system starts by measuring what is already real instead of asking the user to imagine a future stack.",
    list: [
      "Slack connected",
      "GitHub connected",
      "Google connected",
      "Salesforce not yet connected",
    ],
    visual: `
      <div class="status-row">
        <span class="status-pill success">Slack</span>
        <span class="status-pill success">GitHub</span>
        <span class="status-pill success">Google</span>
        <span class="status-pill muted">Salesforce</span>
      </div>
      <div class="metric-card">
        <span>Connected stack coverage</span>
        <strong>3 / 4 providers ready</strong>
      </div>
      <div class="metric-card">
        <span>Deterministic starting point</span>
        <strong>Supported workflows can now be narrowed.</strong>
      </div>
    `,
  },
  prereqs: {
    label: "Step 2",
    title: "Show what is ready before claiming production.",
    text: "Prerequisites stay visible as ready, missing, or partial. The product should prevent a user from walking into a deployment path that is not actually supported.",
    list: [
      "AWS account available",
      "Domain access confirmed",
      "Mac hardware missing",
      "Apple developer account missing",
    ],
    visual: `
      <div class="status-row">
        <span class="status-pill success">AWS</span>
        <span class="status-pill success">Domain</span>
        <span class="status-pill warning">Mac required</span>
        <span class="status-pill warning">Apple Dev required</span>
      </div>
      <div class="metric-card">
        <span>Production readiness</span>
        <strong>Web workflows unlocked, iOS workflows locked.</strong>
      </div>
      <div class="metric-card">
        <span>User experience</span>
        <strong>Missing items become a roadmap instead of a surprise.</strong>
      </div>
    `,
  },
  workflow: {
    label: "Step 3",
    title: "Offer only the workflows that are truly feasible.",
    text: "Workflow eligibility combines connected tools, verified prerequisites, provider approval state, and scopes to produce a deterministic list of options.",
    list: [
      "Daily PR summarizer unlocked",
      "Slack support assistant unlocked",
      "Salesforce sync locked",
      "iOS agent locked",
    ],
    visual: `
      <div class="status-row">
        <span class="status-pill success">PR Summarizer</span>
        <span class="status-pill success">Slack Assistant</span>
        <span class="status-pill muted">Salesforce Sync</span>
        <span class="status-pill muted">iOS Agent</span>
      </div>
      <div class="metric-card">
        <span>Eligibility engine</span>
        <strong>2 workflows supported right now.</strong>
      </div>
      <div class="metric-card">
        <span>Why this matters</span>
        <strong>No overpromising, no dead-end setup paths.</strong>
      </div>
    `,
  },
  roi: {
    label: "Step 4",
    title: "Translate readiness into a concrete ROI story.",
    text: "Once a workflow is supported, the product can estimate hours saved, costs reduced, and delivery upside based on the user’s existing volume and stack.",
    list: [
      "124 pull requests reviewed per month",
      "Estimated 6.5 hours saved weekly",
      "Approx. $2,600 in monthly value",
      "No extra platform migration required",
    ],
    visual: `
      <div class="metric-card">
        <span>Weekly time savings</span>
        <strong>6.5 hours</strong>
      </div>
      <div class="metric-card">
        <span>Monthly value</span>
        <strong>$2,600 equivalent output</strong>
      </div>
      <div class="metric-card">
        <span>Positioning</span>
        <strong>Extend the current stack instead of replacing it.</strong>
      </div>
    `,
  },
  ai: {
    label: "Step 5",
    title: "Match the workflow to the model layer.",
    text: "Model choice should be informed by workflow type and the AI access the user already has. The product narrows to what is both useful and available.",
    list: [
      "OpenAI access detected",
      "Anthropic not yet configured",
      "GPT recommended for ticket and PR summarization",
      "Unavailable models stay locked",
    ],
    visual: `
      <div class="status-row">
        <span class="status-pill success">OpenAI ready</span>
        <span class="status-pill muted">Anthropic missing</span>
      </div>
      <div class="metric-card">
        <span>Recommended model</span>
        <strong>Text workflow: GPT family</strong>
      </div>
      <div class="metric-card">
        <span>Entitlement rule</span>
        <strong>Only available providers should be selectable.</strong>
      </div>
    `,
  },
  scaffold: {
    label: "Step 6",
    title: "Generate a scaffold that can actually move.",
    text: "The result is a ready-to-run blueprint tied to the chosen workflow, connected stack, and model layer. It should feel like a serious starting point, not a toy export.",
    list: [
      "Configured environment contract",
      "Workflow-specific runtime files",
      "Deployment path included",
      "Ready for the next implementation step",
    ],
    visual: `
      <div class="metric-card">
        <span>Output</span>
        <strong>Agent scaffold generated</strong>
      </div>
      <div class="metric-card">
        <span>Included</span>
        <strong>Runtime, config, env contract, deployment notes</strong>
      </div>
      <div class="metric-card">
        <span>Standard</span>
        <strong>Only delivered after support and readiness are real.</strong>
      </div>
    `,
  },
};

const demoTabs = document.querySelectorAll(".demo-tab");
const demoLabel = document.getElementById("demo-label");
const demoTitle = document.getElementById("demo-title");
const demoText = document.getElementById("demo-text");
const demoList = document.getElementById("demo-list");
const demoVisual = document.getElementById("demo-visual");

function renderDemo(stepKey) {
  const step = demoSteps[stepKey];
  if (!step) return;

  demoTabs.forEach((tab) => {
    const active = tab.dataset.step === stepKey;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  demoLabel.textContent = step.label;
  demoTitle.textContent = step.title;
  demoText.textContent = step.text;
  demoList.innerHTML = step.list.map((item) => `<li>${item}</li>`).join("");
  demoVisual.innerHTML = step.visual;
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderDemo(tab.dataset.step);
  });
});

const copyButtons = document.querySelectorAll("[data-copy-target]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

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
