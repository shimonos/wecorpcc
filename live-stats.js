async function updateLiveStats() {
  const status = document.getElementById("stats-status");

  try {
    const response = await fetch(
      "live-stats.json?t=" + Date.now(),
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const stats = await response.json();

    const fields = {
      spectral: "stat-spectral",
      arcane: "stat-arcane",
      elysian: "stat-elysian",
      totalSigils: "stat-total-heading"
    };

    for (const [key, id] of Object.entries(fields)) {
      const value = stats[key];

      if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error("Invalid statistic: " + key);
      }

      document.getElementById(id).textContent =
        value.toLocaleString("en-US");
    }

    // Update the live Discord member count.
    if (
      !Number.isSafeInteger(stats.discordMembers) ||
      stats.discordMembers < 0
    ) {
      throw new Error("Invalid statistic: discordMembers");
    }

    document.querySelectorAll(".live-discord-count").forEach((element) => {
      element.textContent = stats.discordMembers.toLocaleString("en-US");
    });

    // Update both live Corp Pet counters on the homepage.
    if (!Number.isSafeInteger(stats.pet) || stats.pet < 0) {
      throw new Error("Invalid statistic: pet");
    }

    document.querySelectorAll(".live-pet-count").forEach((element) => {
      element.textContent = stats.pet.toLocaleString("en-US");
    });

    // Keep the heading above the sigils synchronized.
    const totalHeading = document.getElementById("stat-total-heading");
    if (totalHeading) {
      totalHeading.textContent = stats.totalSigils.toLocaleString("en-US");
    }

    const updated = new Date(stats.updatedAt);

    status.textContent = Number.isNaN(updated.getTime())
      ? "Statistics loaded"
      : "Last updated: " + updated.toLocaleString();
  } catch (error) {
    console.error("WeCorpCC statistics error:", error);
    status.textContent = "Statistics temporarily unavailable";
  }
}

updateLiveStats();
setInterval(updateLiveStats, 30000);
