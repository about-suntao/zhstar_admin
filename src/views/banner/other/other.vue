<template>
    <div class="tabsChildren">
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
                <el-table-column prop="type" label="页面" show-overflow-tooltip>
                    <template #default="scoped">
                        {{
                            scoped.row.type === 1
                                ? '学校概况'
                                : scoped.row.type === 2
                                ? '学部建设'
                                : scoped.row.type === 3
                                ? '教育教学'
                                : scoped.row.type === 4
                                ? '校园生活'
                                : scoped.row.type === 5
                                ? '学校动态'
                                : ''
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="picture" label="封面">
                    <template #default="scoped">
                        <el-image class="Img" :src="scoped.row.picture"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="标题" show-overflow-tooltip />
                <el-table-column prop="nameEnglish" label="英文" show-overflow-tooltip />
                <el-table-column prop="description" label="描述" show-overflow-tooltip />
                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEditPopup(scope.row)"> 编辑 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                layout="total,prev, pager, next,sizes"
                :total="searchParams.total"
                v-model:current-page="searchParams.pageNum"
                v-model:page-size="searchParams.pageSize"
                @change="getTableData"
            />
        </div>
        <el-dialog v-model="Popup" title="新增" width="650">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="80">
                    <el-form-item label="标题:" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="英文:" prop="nameEnglish">
                        <el-input v-model="userForm.nameEnglish" placeholder="请输入标题英文" />
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <el-input v-model="userForm.description" placeholder="请输入描述" />
                    </el-form-item>
                    <el-form-item label="封面:" prop="picture">
                        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadPicture">
                            <img v-if="userForm.picture" :src="userForm.picture" class="avatar" alt="" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
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
    import { uploadImg } from '@/axios/commonHttps'
    import { getOtherBanner, editOtherBanner } from '../banner.ts'
    import type { UploadRequestOptions, FormRules } from 'element-plus'

    const tableData = ref([])

    const searchParams = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0,
    })

    const Popup = ref(false)

    const userForm = ref({
        id: null,
        name: '',
        picture: null,
        nameEnglish: '',
        description: '',
    })
    const ruleFormRef = ref<any>(null)

    const checkPicture = (rule: any, value: any, callback: any) => {
        if (value) {
            callback()
        } else {
            callback(new Error('请先上传图片!'))
        }
    }

    const rules = reactive<FormRules>({
        picture: [{ required: true, validator: checkPicture, trigger: 'blur' }],
    })

    const getTableData = () => {
        getOtherBanner(searchParams).then((res: any) => {
            if (res.code) {
                tableData.value = res.data.list
                searchParams.total = res.data.total
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const uploadPicture = (params: UploadRequestOptions) => {
        const file = params.file
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((res: any) => {
            if (res.code === 200) {
                userForm.value.picture = res.data.url
                ElMessage.success('图片上传成功')
                ruleFormRef.value?.clearValidate('picture')
            }
        })
    }

    const openEditPopup = (data: any) => {
        userForm.value = { ...data }
        Popup.value = true
    }

    const handleEdit = () => {
        editOtherBanner(userForm.value).then((res: any) => {
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
                handleEdit()
                Popup.value = false
            } else {
                return false
            }
        })
    }
</script>

<style scoped lang="scss">
    .tabsChildren {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        .searchForm {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            .search {
                .el-form {
                    display: flex;
                    flex-wrap: wrap;
                    .el-form-item {
                        width: 300px;
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
                    max-width: 290px;
                    height: auto;
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
                        max-width: 300px;
                        height: auto;
                        display: block;
                    }
                }
            }
        }
    }
</style>
