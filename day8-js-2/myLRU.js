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
                    var removedValue = this.queue.pop();
                    delete this.keyValueStorage[removedValue];
                    this.setValueAndAddToQueue(request);
                }

            } else {
                this.setValueAndAddToQueue(request);
            }

            return this.keyValueStorage[request];
        },

        setValueAndAddToQueue: function (value) {
            this.queue.unshift(value);
            this.keyValueStorage[value] = value + 'ok ';
        }
    }
}






