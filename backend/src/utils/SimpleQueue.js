class SimpleQueue {
    constructor(limit = 50) {
        this.data = [];
        this.resultLimit = limit;
    }

    enqueue(item) {
        if (this.data.length >= this.resultLimit) {
            this.data.shift();
        }
        this.data.push(item);
    }

    dequeue() {
        return this.data.shift(); // Remove the first item
    }

    size() {
        return this.data.length;
    }

    getAll() {
        return this.data;
    }
}

module.exports = SimpleQueue;