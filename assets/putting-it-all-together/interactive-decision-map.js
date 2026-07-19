(() => {
  const stage = document.querySelector("[data-decision-path]");
  const trigger = stage?.querySelector("[data-code-clue]");
  const instruction = document.querySelector("[data-code-instruction]");
  const fullscreenTrigger = stage?.querySelector("[data-map-fullscreen]");
  const fullscreenTarget = stage?.closest(".decision-path-scroll");

  if (!stage || !trigger) return;

  trigger.addEventListener("click", () => {
    const revealed = stage.classList.toggle("is-revealed");
    trigger.setAttribute("aria-pressed", String(revealed));
    trigger.setAttribute(
      "aria-label",
      revealed ? "Hide the pencilled Python hints" : "Reveal the pencilled Python hints"
    );

    if (instruction) {
      instruction.textContent = revealed
        ? "The code clues are now visible. Select the magnifying glass again to hide them."
        : "Something has been left in pencil. Examine the magnifying glass.";
    }
  });

  if (fullscreenTrigger && fullscreenTarget) {
    const setFullscreenLabel = (expanded) => {
      fullscreenTrigger.setAttribute(
        "aria-label",
        expanded ? "Close the full-screen decision map" : "Open the decision map full screen"
      );
      fullscreenTrigger.querySelector("span").textContent = expanded
        ? "Close the full-screen decision map"
        : "Open the decision map full screen";
    };

    const closeFallback = () => {
      fullscreenTarget.classList.remove("is-expanded");
      document.documentElement.classList.remove("has-expanded-decision-map");
      setFullscreenLabel(false);
    };

    const openFallback = () => {
      fullscreenTarget.classList.add("is-expanded");
      document.documentElement.classList.add("has-expanded-decision-map");
      setFullscreenLabel(true);
    };

    fullscreenTrigger.addEventListener("click", async () => {
      if (fullscreenTarget.classList.contains("is-expanded")) {
        closeFallback();
        return;
      }

      if (document.fullscreenElement === fullscreenTarget) {
        await document.exitFullscreen();
        return;
      }

      if (document.fullscreenEnabled && fullscreenTarget.requestFullscreen) {
        try {
          await fullscreenTarget.requestFullscreen();
          return;
        } catch {
          openFallback();
          return;
        }
      }

      openFallback();
    });

    document.addEventListener("fullscreenchange", () => {
      setFullscreenLabel(document.fullscreenElement === fullscreenTarget);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && fullscreenTarget.classList.contains("is-expanded")) {
        closeFallback();
        fullscreenTrigger.focus();
      }
    });
  }
})();
