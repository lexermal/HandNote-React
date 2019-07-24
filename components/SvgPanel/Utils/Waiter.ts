export default class Waiter {

    private loopRunning = false;
    private startTime = new Date();
    private defaultWaitingTime: number;
    private onCountDownReached: () => void;

    constructor(onCountDownReached: () => void, waitingTime: number) {
        this.onCountDownReached = onCountDownReached;
        this.defaultWaitingTime = waitingTime;
    }

    private resetTime() {
        this.startTime = new Date();
    }

    public startCountDown() {
        this.resetTime();

        if (!this.loopRunning) {
            this.loopRunning = true;
            this.loop();
        }
    }

    private loop() {
        console.log("loop/wait",)
        if (this.checkIfTimeParsed()) {
            console.log("submit",)
            this.onCountDownReached();
            this.loopRunning = false;
        } else {
            setTimeout(() => this.loop(), 1000)
        }
    }

    private checkIfTimeParsed(): boolean {
        const now = new Date();
        const old = new Date(this.startTime);

        old.setSeconds(old.getSeconds() + (this.defaultWaitingTime / 1000));

        return now.getTime() > old.getTime();
    }
}
