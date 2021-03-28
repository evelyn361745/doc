function defineReactive (data, key, val) {
    let dep = []; // 新增，存储当前key的依赖
    Object.defineProperty (data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.push(window.target) // add
            return val;
        },
        set: function (newVal) {
            if (val === newVal) {
                return;
            }
            // add
            for (let i = 0; i < dep.length; i++) {
                dep[i](newVal, val)
            }
            val = newVal;
        }
    })
}
// =====================
export default class Dep {
    constructor () {
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    removeSub (sub) {
        remove (this.subs, sub)
    }

    depend () {
        if (window.target) {
            this.addSub(window.target)
        }
    }

    notify () {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

function defineReactive (data, key, val) {
    let dep = new Dep(); // update
    Object.defineProperty (data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend() // update
            return val;
        },
        set: function (newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            dep.notify() // update
        }
    })
}

vm.$watch('a.b.c', function (newVal, oldVal) {
    // todo
})

export default class Watcher {
    constructor (vm, expOrFn, cb) {
        this.vm = vm
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value = this.get();
    }

    get () {
        window.target = this
        let value = this.getter.call(this.vm, this.vm) // 为什么是两个this.vm，因为要获取vm上的参数，得获取到vm的环境
        window.target = undefined
        return value
    }

    update () {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}
/**
 * 解析简单路径
 */
const bailRE = /[^\w.$]/
export function parsePath (path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]] // a.b.c将a，b，c都作为依赖收集
        }
        return obj
    }
}
/**
 * Observer类会附加到每一个被侦测的object上，
 * 一旦被附加上，Observer会将object的所有属性转换成getter/setter的形式来收集属性的依赖
 * 并且当属性发生变化时会通知这些依赖
 */
export class Observer {
    constructor (value) {
        this.value = value;

        if (!Array.isArray(value)) {
            this.walk(value);
        }
    }
    /**
     * 
     * walk会将每一个属性都转换成getter/setter的形式来侦测变化
     * 这个方法只有在数据类型为object时被调用
     */
    walk (obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]]);
        }
    }
}

function defineReactive(data, key, val) {
    if (typeof val === 'object') {
        new Observer(val);
    }
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            dep.depend();
            return val;
        },
        set: function(newVal) {
            if(val === newVal) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    })
}

var vm = new Vue({
    el: '#el',
    template: '#demo-template',
    data: {
        obj: {},
    },
    methods: {
        action() {
            this.obj.name = 'brewin';
        }
    }
})

var vm = new Vue({
    el: '#el',
    template: '#demo-template',
    data: {
        obj: {
            name: 'brewin',
        },
    },
    methods: {
        action() {
            delete this.obj.name;
        }
    }
})