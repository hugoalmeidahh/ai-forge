---
name: ai-forge-quality-android-testing
description: "Test an Android app on an explicitly available emulator/device through a real connector or authorized ADB, with build/device evidence and honest capability limits."
---

# Android testing

This skill guides an existing device capability; it does not provide a device connector. A mobile browser viewport is web QA, not native Android validation.

1. Discover available device tools or authorized ADB and identify the app/package, build/variant, target device and requested journey. Confirm ambiguous or personal-device targets before acting.
2. Inspect the actual screen/accessibility tree before each dependent action. Use discovered targets; coordinate taps require current dimensions and visible evidence.
3. Reproduce the main journey, relevant invalid-input/offline/permission cases and observable result. Use the repository's build/test commands when available; test data must be appropriate for that device/environment.
4. Capture only task-related screenshots/logs with app and device context. Keep personal content, credentials and unrelated device data out of evidence and public commits.
5. Separate passed, failed and not run. If there is no connector/device, deliver the test plan and missing prerequisite, not a fabricated pass.

Installing a test build follows the requested environment scope. Clearing data, uninstalling apps, rooting, enabling network debugging, rebooting a personal device or performing real financial/message actions are not implied by testing a screen. Preserve the device and unrelated processes at completion.
