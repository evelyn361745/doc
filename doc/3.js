Vue.prototype.$watch = function(expOrFn, cb, options) {
    const vm = this;
    options = options || {};
    const watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
        cb.call(vm, watcher.value)
    }
    return function unwatchFn() { // 取消观察数据
        watcher.teardown(); // 将当前watcher实例从正在观察的状态依赖列表中移除
    }
}

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn; // 函数直接赋值给getter
        } else {
            this.getter = parsePath(expOrFn); // 不是，解析属性路径，依次收集
        }
        this.deps = [] // 2.add记录当前Watcher已经订阅的Dep
        this.depIds = new Set() // 2.add记录当前Watcher已经订阅的DepId
        this.cb = cb;
        this.value = this.get();
    }

    addDep(dep) { // 2.add
        const id = dep.id;
        if (!this.depIds.has(id)) { // 2. 判断当前watcher是否已经订阅该Dep
            this.depIds.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
    }
    /**
     * 从所有依赖项的Dep列表中将自己移除
     */
    teardown() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].removeSub(this);
        }
    }
}

let uid = 0;

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    depend() {
        if (window.target) {
            window.target.addDep(this);
        }
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            return this.subs.splice(index, 1);
        }
    }
}

export function set(target, key, val) {
    if(Array.isArray(target) && isValidArrayIndex(key)) {
        target.length == Math.max(target.length, key);
        target,splice(key, 1, val);
        return val;
    }
}