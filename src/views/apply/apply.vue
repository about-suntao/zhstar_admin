<template>
    <div class="product">
        <pageTitle name="招生报名"></pageTitle>
        <div class="searchForm">
            <div class="search"></div>
            <div class="buttonGroup"></div>
        </div>
        <div class="commonTable">
            <el-table
                :data="tableData"
                class="elTable"
                :header-cell-style="{
                    textAlign: 'center',
                    height: '60px',
                    fontSize: '18PX',
                    fontWeight: 'Bold',
                    color: 'black',
                    background: '#FFDCDE',
                }"
                :cell-style="{ textAlign: 'center', fontWeight: '400' }"
                border
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="页面" />
                <el-table-column prop="url" label="链接" />
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEditPopup(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="Popup" title="编辑链接" width="550">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="70">
                    <el-form-item label="名称:" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item label="链接:" prop="url">
                        <el-input v-model="userForm.url" placeholder="请输入链接" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="Popup = false">取消</el-button>
                    <el-button type="primary" @click="submitForm"> 确认 </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, onMounted } from 'vue'
    import { getInfo, editInfo } from './apply'
    import type { FormRules } from 'element-plus'

    const tableData = ref([])

    const Popup = ref(false)

    const userForm = ref({
        id: null,
        name: '',
        url: '',
    })

    const ruleFormRef = ref<any>(null)

    const rules = reactive<FormRules>({
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
    })

    const getTableData = () => {
        getInfo().then((res: any) => {
            if (res.code) {
                tableData.value = res.data
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const openEditPopup = (data: any) => {
        userForm.value = {
            id: data.id,
            name: data.name,
            url: data.url,
        }
        Popup.value = true
    }

    const editUser = () => {
        editInfo(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('修改成功')
                getTableData()
            }
        })
    }

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                editUser()
                Popup.value = false
            } else {
                return false
            }
        })
    }
</script>

<style lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
</style>

<style scoped lang="scss">
    .product {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        padding: 10px 30px;
        .searchForm {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            .search {
                .el-form {
                    display: flex;
                    flex-wrap: wrap;
                    .el-form-item {
                        width: 250px;
                        margin-right: 20px;
                    }
                    .el-form-item:last-child {
                        width: auto;
                    }
                }
            }
            .buttonGroup {
                display: flex;
                justify-content: flex-end;
            }
        }
        .commonTable {
            margin: 10px 0;
            flex: 1;
            overflow: hidden;
            .elTable {
                width: 100%;
                height: 100%;
                .Img {
                    width: 80px;
                    height: 80px;
                }
            }
            :deep(.el-scrollbar__wrap) {
                display: flex;
            }
            :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
                background: #fff7f7;
            }
        }
        .pagination {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @media screen and (max-width: 1300px) {
            .pagination {
                padding-bottom: 20px;
            }
        }

        .e_body {
            width: 100%;
            display: flex;
            justify-content: center;
            .el-form {
                width: 80%;
                .avatar-uploader {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    .avatar {
                        width: 178px;
                        height: 178px;
                        display: block;
                    }
                }
            }
        }
    }
</style>
