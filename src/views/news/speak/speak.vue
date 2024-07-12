<template>
    <div class="product">
        <pageTitle name="国旗下讲话"></pageTitle>
        <div class="searchForm">
            <div class="search">
                <el-form :model="searchParams">
                    <el-form-item label="标题：">
                        <el-input
                            v-model="searchParams.title"
                            @change="getTableData"
                            clearable
                            placeholder="请输入标题"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="clearSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="buttonGroup">
                <el-button type="primary" @click="openAddPopup">新增</el-button>
            </div>
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
                    background: '#EEF4FF',
                }"
                :cell-style="{ textAlign: 'center', fontWeight: '400' }"
                border
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="openEditPopup(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="delUser(scope.row)">删除</el-button>
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
        <el-dialog v-model="Popup" :title="PopupStatus === 'add' ? '新增文章' : '编辑文章'" width="1000">
            <div class="e_body">
                <el-form :model="userForm" ref="ruleFormRef" :rules="rules" label-width="90">
                    <el-form-item label="发布时间:" prop="createTime">
                        <el-date-picker v-model="userForm.createTime" type="date" placeholder="请选择文章发布时间" />
                    </el-form-item>
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="userForm.title" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="发布时间:" prop="content">
                        <Tinymce v-model="userForm.content" :height="400"></Tinymce>
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
    import { getArticle, addArticle, editArticle, delArticle, getArticleDetail } from '../news'
    import type { UploadRequestOptions, FormRules } from 'element-plus'
    import Tinymce from '@/components/tinymce/index.vue'

    const tableData = ref([])
    const searchParams = reactive({
        title: null,
        pageNum: 1,
        pageSize: 20,
        total: 0,
    })

    const Popup = ref(false)
    const PopupStatus = ref('')

    const userForm = ref({
        id: null,
        title: '',
        createTime: '',
        content: '',
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
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入讲话内容', trigger: 'blur' }],
    })

    const getTableData = () => {
        getArticle(searchParams).then((res: any) => {
            if (res.code) {
                tableData.value = res.data.list
                console.log('🚀 ~ getArticle ~ tableData.value:', tableData.value)
                searchParams.total = res.data.total
            }
        })
    }

    const getDetail = (id: number) => {
        getArticleDetail(id).then((res: any) => {
            if (res.code) {
                userForm.value.content = res.data.content
            }
        })
    }

    onMounted(() => {
        getTableData()
    })

    const clearSearch = () => {
        searchParams.title = null
        getTableData()
    }

    const openAddPopup = () => {
        userForm.value = {
            id: null,
            title: '',
            createTime: '',
            content: '',
        }
        PopupStatus.value = 'add'
        Popup.value = true
        ruleFormRef.value?.clearValidate()
    }

    const openEditPopup = (data: any) => {
        userForm.value = { ...data }
        getDetail(data.id)
        PopupStatus.value = 'edit'
        Popup.value = true
    }

    const addUser = () => {
        addArticle(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('新增成功')
                getTableData()
            }
        })
    }

    const editUser = () => {
        editArticle(userForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('修改成功')
                getTableData()
            }
        })
    }

    const delUser = (data: any) => {
        console.log('🚀 ~ delUser ~ data:', data)
        ElMessageBox({
            title: '提示',
            message: `确认删除该文章吗？`,
            showCancelButton: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            customStyle: { width: '200px' },
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    delArticle(data.id).then((res: any) => {
                        instance.confirmButtonLoading = false
                        done()
                        if (res.code === 200) {
                            ElMessage.success('删除成功')
                            getTableData()
                        }
                    })
                } else {
                    done()
                }
            },
        })
    }

    const submitForm = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                PopupStatus.value === 'add' ? addUser() : editUser()
                Popup.value = false
            } else {
                return false
            }
        })
    }
</script>

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
        }
    }
</style>
