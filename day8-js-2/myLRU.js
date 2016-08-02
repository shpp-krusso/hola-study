function MyLRU(capacity) {
    return {
        queue: [],
        keyValueStorage: {},
        maxCapacity: capacity,
        getResult: function (request) {
            if (this.queue.length >= this.maxCapacity) {

                if (this.keyValueStorage[request]) {
                    for (var i = 0; i < this.queue.length; i++) {
                        if (this.queue[i] == request) {
                            this.queue.splice(i, 1);
                            this.queue.unshift(request);
                            break;
                        }
                    }
                } else {
                    this.queue.unshift(request);
                    var removedValue = this.queue.pop();
                    delete this.keyValueStorage[removedValue];
                    this.keyValueStorage[request] = request + ' ok';
                }
            } else {
                this.queue.unshift('request');
                this.keyValueStorage[request] = request + 'ok ';
            }
            return this.keyValueStorage[request];
        }
    }
}

