sfunction $(selector) {
	
    return {

        elem: function () {
            return document.querySelectorAll(selector);
        }(),

        text: function (value) {
            if (value) {
                this.elem.forEach(function(item) {
                    item.innerHTML = value;
                });
            } else {
                if (this.elem.length == 1) {
                    return this.elem[0].innerHTML;
                }
            }
        }
    }
}

