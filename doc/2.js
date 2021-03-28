const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto);
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function(method) {
    // 缓存原始方法
    const  original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        value: function mutator(...args) {
            return original.apply(this, args)
        },
        enumerable: false,
        writable: true,
        configurable: true,
    })
})

export class Observer {
    constructor (value) {
        this.value = value;

        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods
        } else {
            this.walk(value);
        }
    }
}

import { arrayMethods } from './array';

// __proto__是否可用
const hasProto = '__proto__' in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer {
    constructor(value) {
        this.value = value;

        if (Array.isArray(value)) {
            //update
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
        } else {
            this.walk(value);
        }
    }
}

function protoAugment(target, src, keys) {
    target.__proto__ = src;
}

function copyAugment(target, src, keys) {
    for(let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        def(target, key, src[key]);
    }
}

function defineReactive(data, key, val) {
    if (typeof val === 'object') new Observer(val);
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            dep.depend(); // 收集依赖
            return val;
        },
        set: function(newVal) {
            if (val === newVal) {
                return;
            }
            dep.notify();
            this.val = newVal;
        }
    })
}

export class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep() // 新增Dep

        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
        } else {
            this.walk(value);
        }
    }
}

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    })
}

export class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);  // new add

        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
        } else {
            this.walk(value);
        }
    }
}

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function(method) {
    // 缓存原始方法
    const  original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        value: function mutator(...args) {
            const ob = this.__ob__; 
            return original.apply(this, args)
        },
        enumerable: false,
        writable: true,
        configurable: true,
    })
})

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function(method) {
    // 缓存原始方法
    const  original = arrayProto[method]

    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;  // 通过this.__ob__获取Observer实例
        ob.dep.notify();
        return result;
    })
})

export class Observer {
    constructor(value) {
        this.value = value;
        def(value, '__ob__', this);

        // new add
        if(Array.isArray(value)) {
            this.ObserverArray(value);
        } else {
            this.walk(value);
        }
    }
}
/**
 * 侦测数组中的每一项
 */
ObserverArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i])
    }
}

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function(method) {
    // 缓存原始方法
    const  original = arrayProto[method]

    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;  // 通过this.__ob__获取Observer实例
        let inserted;
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args; // 提取元素
                break;
            case 'splice':
                inserted = args.slice(2)
                break;
        }
        ob.dep.notify();
        return result;
    })
})