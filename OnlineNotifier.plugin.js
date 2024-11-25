/**
 * @name OnlineNotifier
 * @version 1.0.0
 * @description Alerts when a specific user gets online, including playing the Discord join sound.
 * @author PROPHECY
 */

module.exports = class OnlineNotifier {
    constructor() {
        this.userId = "12345"; // Replace with the target user's ID
        this.interval = null;
        this.notified = false;
        this.joinSoundUrl = "https://www.myinstants.com/media/sounds/discord-notification.mp3"; // URL for the join sound
    }

    start() {
        // Check if required Discord modules are available
        const userModule = BdApi.findModuleByProps("getUser");
        const statusModule = BdApi.findModuleByProps("getStatus");

        if (!userModule || !statusModule) {
            BdApi.showToast("Required modules not found. Update BetterDiscord!", { type: "error" });
            return;
        }

        this.userModule = userModule;
        this.statusModule = statusModule;

        this.monitorUser();
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    monitorUser() {
        this.interval = setInterval(() => {
            try {
                const user = this.userModule.getUser(this.userId);
                const status = this.statusModule.getStatus(this.userId);

                if (!user) {
                    console.error(`User with ID ${this.userId} not found.`);
                    return;
                }

                if (status === "online" && !this.notified) {
                    this.notified = true;
                    BdApi.showToast(`${user.username} is now online!`, { type: "info" });
                    this.playJoinSound();
                } else if (status !== "online") {
                    this.notified = false;
                }
            } catch (error) {
                console.error("Error in OnlineNotifier:", error);
            }
        }, 5000); // Check every 5 seconds
    }

    playJoinSound() {
        const audio = new Audio(this.joinSoundUrl);
        audio.volume = 0.5; // Adjust volume if necessary
        audio.play().catch((error) => {
            console.error("Error playing join sound:", error);
        });
    }
};
