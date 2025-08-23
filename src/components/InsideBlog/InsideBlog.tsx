
import { NavLink } from '@umijs/max';
import { request } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';
import { Image, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './InsideBlog.less';
import { TableRowSelection } from 'antd/es/table/interface';


interface DataType {
    key: React.Key;
    id: string;
    imgSrc: string;
    introduction: string;
    author: string;
}

const App: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState();
    const [blogList, setBlogList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    useEffect(() => {
        request('/admin/secure/showMyBlogsInfo', {
            params: {
                page,
                pageSize,
            },
        }).then((data) => {
            if (data.result) {
                setTotal(data.data.count);
                // let articleList=data.data.articleList;
                setBlogList(data.data.myBlogList);
            }
        });
    }, [page, pageSize]);

    //页码变化
    const handelPageSizeChange = (page: number, pagesize: number) => {
        console.log(page, pagesize);
        setPageSize(pagesize);
        setPage(page);
        setSelectedRowKeys([]);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => +a.id - +b.id,
        },
        {
            title: '缩略图',
            width: 100,
            render: (imgSrc: string) => {
                return <Image src={imgSrc} style={{ width: 100 }}></Image>;
            },
            dataIndex: 'imgSrc',
        },
        {
            title: '文章简介',
            render: (introduction: string, onelineData: any) => {
                // console.log(onelineData);
                return (
                    <NavLink
                        to={`/backend/addInsideBlogArticle/${onelineData.id}`}
                        style={{ display: 'inline-block', width: 60 }}
                    >
                        {introduction ? introduction : "点击这里跳转"}
                    </NavLink>
                );
            },
            dataIndex: 'introduction',
        },

        {
            title: '操作员',
            dataIndex: 'author',
        },


    ];
    return (
        <div className={styles.container} style={{ position: "relative", height: "100%" }}>
            这是blog，所有的文章在这边都无法展示到前端，需要在运势那边进行最终的修改
            <Table
                className="mainShowTable"
                pagination={{
                    position: ['topRight'],
                    pageSize: pageSize,
                    pageSizeOptions: [40, 100, 200],
                    showQuickJumper: true,
                    onChange(page, pageSize) {
                        handelPageSizeChange(page, pageSize);
                    },
                    total: total,
                }}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={blogList}
            />
        </div>
    );
};
export default App;
