<template>
    <div class="addNews">
        <div class="addNews-top">
            <pageTitle name="新增新闻" v-if="!pageStatus"></pageTitle>
            <pageTitle name="编辑新闻" v-if="pageStatus"></pageTitle>
            <div>
                <el-button type="info" v-if="pageStatus" @click="backList">返回</el-button>
                <el-button type="warning" @click="clearForm">重置内容</el-button>
                <el-button type="primary" v-if="!pageStatus" @click="submitDraft">发布草稿</el-button>
                <el-button type="success" v-if="pageStatus" @click="updateDraft">确认修改</el-button>
            </div>
        </div>
        <div class="addNews-form">
            <el-form :model="form" ref="ruleFormRef" :rules="rules" label-position="left" label-width="100px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="标题：" prop="title">
                            <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
                        </el-form-item>
                        <el-form-item label="描述:" prop="description">
                            <el-input v-model="form.description" placeholder="请输入文章描述" clearable />
                        </el-form-item>
                        <el-form-item label="类型：" prop="typeId">
                            <div class="itemForm">
                                <el-select
                                    v-model="form.typeId"
                                    placeholder="请选择文章类型"
                                    style="width: 240px"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    />
                                </el-select>
                                <el-button type="primary" @click="openTypeDialog">编辑</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="发布时间：" prop="createTime">
                            <el-date-picker v-model="form.createTime" type="date" placeholder="请选择文章发布时间" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="2"> </el-col>
                    <el-col :span="10">
                        <el-form-item label="关键字：" prop="keywords">
                            <el-input v-model="form.keywords" placeholder="请输入文章关键字" clearable />
                        </el-form-item>
                        <el-form-item label="封面：" prop="picture">
                            <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadPicture">
                                <img v-if="form.picture" :src="form.picture" class="avatar" alt="" />
                                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="新闻内容：">
                            <Tinymce v-model="form.content"></Tinymce>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog v-model="Popup" title="文章类型" width="800">
                <div class="e_body">
                    <div class="e_body-left">
                        <div v-for="item in typeOptions" class="leftItem">
                            <p>{{ item.name }}</p>
                            <div class="btn_group">
                                <el-button type="success" size="small" @click="editType(item)">编辑</el-button>
                                <el-button type="danger" size="small" @click="delType(item)">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="e_body-right">
                        <el-form :model="typeForm" ref="ruleFormRef" :rules="rules" label-width="70">
                            <el-form-item label="用户名:" prop="name">
                                <el-input v-model="typeForm.name" placeholder="请输入文章类型" clearable />
                            </el-form-item>
                            <div class="typeSubmit">
                                <el-button v-if="!typeFormStatus" type="primary" size="small" @click="addType">
                                    新增
                                </el-button>
                                <el-button v-if="typeFormStatus" type="warning" size="small" @click="cancelEdit">
                                    取消
                                </el-button>
                                <el-button v-if="typeFormStatus" type="primary" size="small" @click="updateType">
                                    修改
                                </el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { uploadImg } from '@/axios/commonHttps'
    import type { UploadRequestOptions, FormRules } from 'element-plus'
    import Tinymce from '@/components/tinymce/index.vue'
    import { getNewsType, addNewsType, editNewsType, delNewsType, addNews, getNewsDetail, editNews } from '../news'
    import { useRouter, onBeforeRouteLeave } from 'vue-router'

    const router = useRouter()
    const form = ref({
        title: '',
        picture: '',
        keywords: '',
        description: '',
        content: '',
        typeId: null,
        createTime: '',
    })

    const oldFrom = ref({})

    // 页面状态，是否是编辑页面
    const pageStatus = ref(false)

    const ruleFormRef = ref<any>(null)
    const typeOptions = ref<any>([])

    const checkPicture = (rule: any, value: any, callback: any) => {
        if (value) {
            callback()
        } else {
            callback(new Error('请先上传图片!'))
        }
    }

    const rules = reactive<FormRules>({
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        keywords: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        picture: [{ required: true, validator: checkPicture, trigger: 'blur' }],
    })

    const Popup = ref<any>(false)
    const typeFormStatus = ref(false)
    const typeForm = ref({
        id: null,
        name: '',
    })

    // 获取文章类型
    const getType = () => {
        getNewsType().then((res: any) => {
            if (res.code === 200) {
                typeOptions.value = res.data.list
            }
        })
    }

    const getDetail = (id: string) => {
        getNewsDetail(id).then((res: any) => {
            if (res.code === 200) {
                form.value = res.data
                oldFrom.value = JSON.stringify(form.value)
            }
        })
    }

    onMounted(() => {
        getType()
        if (router.currentRoute.value.query.id) {
            const id: any = router.currentRoute.value.query.id
            pageStatus.value = true
            getDetail(id)
        }
        oldFrom.value = JSON.stringify(form.value)
    })

    const openTypeDialog = () => {
        Popup.value = true
    }

    const addType = () => {
        const params = {
            name: typeForm.value.name,
        }
        addNewsType(params).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('新增成功')
                typeForm.value.name = ''
                getType()
            }
        })
    }

    const editType = (data: any) => {
        typeForm.value.name = data.name
        typeForm.value.id = data.id
        typeFormStatus.value = true
    }

    const cancelEdit = () => {
        typeForm.value.name = ''
        typeFormStatus.value = false
    }

    const updateType = () => {
        editNewsType(typeForm.value).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('修改成功')
                typeForm.value.name = ''
                typeFormStatus.value = false
                getType()
            }
        })
    }

    const delType = (data: any) => {
        delNewsType(data.id).then((res: any) => {
            if (res.code === 200) {
                ElMessage.success('删除成功')
                getType()
            }
        })
    }

    const uploadPicture = (params: UploadRequestOptions) => {
        const file = params.file
        const formData = new FormData()
        formData.append('file', file)
        uploadImg(formData).then((res: any) => {
            if (res.code === 200) {
                form.value.picture = res.data.url
                ElMessage.success('图片上传成功')
                ruleFormRef.value?.clearValidate('picture')
            }
        })
    }

    const backList = () => {
        router.push('/news/list')
    }

    const clearForm = () => {
        form.value = {
            title: '',
            picture: '',
            keywords: '',
            description: '',
            content: '',
            typeId: null,
            createTime: '',
        }
        nextTick(() => {
            ruleFormRef.value?.clearValidate()
        })
    }

    const submitDraft = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                ElMessageBox({
                    title: '提示',
                    message: `确认发布当前草稿！`,
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    customStyle: { width: '200px' },
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            addNews(form.value).then((res: any) => {
                                instance.confirmButtonLoading = false
                                done()
                                if (res.code === 200) {
                                    ElMessage.success('发布草稿成功')
                                    clearForm()
                                }
                            })
                        } else {
                            done()
                        }
                    },
                })
            } else {
                return false
            }
        })
    }

    const updateDraft = () => {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validate((valid: any) => {
            // 表单验证成功
            if (valid) {
                // 获取规格信息
                ElMessageBox({
                    title: '提示',
                    message: `确认修改当前草稿！`,
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    customStyle: { width: '200px' },
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            editNews({ id: router.currentRoute.value.query.id, ...form.value }).then((res: any) => {
                                instance.confirmButtonLoading = false
                                done()
                                if (res.code === 200) {
                                    ElMessage.success('修改草稿成功')
                                    oldFrom.value = JSON.stringify(form.value)
                                    router.push('/news/list')
                                }
                            })
                        } else {
                            done()
                        }
                    },
                })
            } else {
                return false
            }
        })
    }

    onBeforeRouteLeave((to: any, from: any, next: any) => {
        //检查页面是否修改内容
        const value = JSON.stringify(form.value)
        if (oldFrom.value !== value) {
            ElMessageBox({
                title: '提示',
                message: `当前页面修改内容尚未保存，是否离开页面！`,
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                customStyle: { width: '400px' },
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = false
                        done()
                        next()
                    } else {
                        done()
                    }
                },
            })
        } else {
            next()
        }
    })
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
    .addNews {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        &-top {
            display: flex;
            justify-content: space-between;
        }
        &-form {
            height: calc(100vh - 160px);
            overflow: scroll;
            margin: 60px 20px;
            :deep(.el-form-item) {
                margin-bottom: 30px;
            }
            :deep(.el-form) {
                .avatar-uploader {
                    display: flex;
                    justify-content: center;
                    .avatar {
                        width: 178px;
                        height: 178px;
                        display: block;
                    }
                }
                .el-date-editor {
                    width: 100% !important;
                }
                .el-select {
                    width: 100% !important;
                }
                .itemForm {
                    width: 100%;
                    display: flex;
                    .el-button {
                        margin-left: 10px;
                    }
                }
            }
            .e_body {
                display: flex;
                &-left {
                    width: 48%;
                    .leftItem {
                        display: flex;
                        justify-content: space-between;
                    }
                    .leftItem + .leftItem {
                        margin-top: 10px;
                    }
                }
                &-right {
                    margin-left: 5%;
                    width: 40%;
                    .typeSubmit {
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
    }
</style>
