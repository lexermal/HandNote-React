export default class Waiter {

    private loopTime = 500;
    private loopRunning = false;
    private countDownStop = false;
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

    public stopCountDown() {
        this.countDownStop = true;
    }

    private loop() {
        console.log("wait",);
        if (this.countDownStop) {
            this.loopRunning = false;
            this.countDownStop = false;
            console.log("stop",)

        } else if (this.checkIfTimeParsed()) {
            console.log("submit",);
            this.onCountDownReached();
            this.loopRunning = false;
        } else {
            setTimeout(() => this.loop(), this.loopTime)
        }
    }

    private checkIfTimeParsed(): boolean {
        const now = new Date();
        const old = new Date(this.startTime);

        old.setSeconds(old.getSeconds() + (this.defaultWaitingTime / 1000));

        return now.getTime() > old.getTime();
    }
}
