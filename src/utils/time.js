export default class Time {
  constructor(val) {
    this.value = val || new Date()
  }

  static of(value) {
    return new Time(value)
  }

  // 获取当前年份
  getYear() {
    return this.value.getFullYear()
  }

  getMonth() {
    return (this.value.getMonth() + 1)
  }
}

