<template>
    <div class="pagination">
        <button @click="$emit('getPageNo',pageNo - 1)" :disabled="pageNo==1">上一页</button>
        <button v-if="startAndEnd.start*1 > 1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
        <button v-if="startAndEnd.start*1 > 2">.....</button>

        <!-- 中间连续页码的地方:v-for、数组、对象、数字、字符串 -->
            <button v-for="(page,index) in startAndEnd.end*1" :key="index" v-show="page >= startAndEnd.start"
                @click="$emit('getPageNo',page)" :class="{active:pageNo==page}">{{ page }}</button>

        <button v-if="startAndEnd.end*1 < totalPage - 1 ">......</button>
        <button v-if="startAndEnd.end*1 < totalPage" :class="{active:pageNo==totalPage}" @click="$emit('getPageNo',totalPage)">{{ totalPage }}</button>

        <button @click="$emit('getPageNo',pageNo + 1)" :disabled="pageNo==totalPage">下一页</button>

        <button style="margin-left: 30px">共 {{ total }} 条</button>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ["pageNo", "pageSize", "total", "continues"],
    computed: {
        // 计算总共多少页
        totalPage() {
            // 向上取整Math.ceil
            return Math.ceil(this.total / this.pageSize)
        },
        // 计算连续页码的起始数字与结束数字
        startAndEnd() {
            const { pageNo, continues, totalPage } = this
            // 先定义两个变量存储起始数字与结束数字
            let start = 0
            let end = 0
            // 如果总页数没有连续页码多
            if (continues > totalPage) {
                start = 1
                end = totalPage
            } else {
                // 正常现象连续页码小于总页数
                start = pageNo - parseInt(continues / 2)
                end = pageNo + parseInt(continues / 2)
                // 把出现不正常现象【start数字出现0或负数】纠正
                if (start < 1) {
                    start = 1
                    end = continues
                }
                // 把出现不正常现象【end数字大于总页数】纠正
                if (end > totalPage) {
                    end = totalPage
                    start = totalPage - continues + 1
                }
            }
            return { start, end}
        }
    },
}
</script>

<style scoped>
@import './index.css';
</style>
