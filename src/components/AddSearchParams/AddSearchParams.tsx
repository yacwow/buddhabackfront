import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useModel } from '@umijs/max';
import { request } from '@umijs/max';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        // rules={[
        //     {
        //         required: true,
        //         message: `${title} is required.`,
        //     },
        // ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

export interface DataType {
  key: React.Key;
  前台展示的日文关键字: string;
  关键字的英文名字: string;
  袖丈: string;
  着丈: string;
  'サイズ(cm)': string;
  裾まわり: string;
  ウエスト: string;
  ヒップ: string;
  パンツ丈: string;
  'オススメ/kg': string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App: React.FC = () => {
  const { setProductId } = useModel('productUpdateData');
  const { dataSource, setDataSource } = useModel('globalState');

  const [count, setCount] = useState(dataSource.length);

  const handleDelete = (key: React.Key) => {
    console.log(dataSource, key);
    const newData = dataSource.filter((item) => {
      console.log(item, key);
      return item.key !== key;
    });
    console.log(newData);
    setDataSource([...newData]);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '日文关键字，前台客户看得',
      dataIndex: 'サイズ(cm)',
      width: '20%',
      editable: true,
    },
    {
      title: '关键字的英文名字，后台搜索用的',
      dataIndex: '着丈',
      width: '20%',
      editable: true,
    },
    {
      title: '关键字的类别，例如勾选，产品',
      dataIndex: '袖丈',
      width: '20%',
      editable: true,
    },
    {
      title: '活跃状态，不活跃的不会在前台展示',
      dataIndex: '肩幅',
      width: '20%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record: { key: React.Key }) => (
        <Popconfirm
          title="确定删除吗?"
          onConfirm={() => {
            console.log(record);
            handleDelete(record.key);
          }}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];
  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      'サイズ(cm)': '',
      着丈: '',
      袖丈: '',
      肩幅: '',
      バスト: '',
      裾まわり: '',
      ウエスト: '',
      ヒップ: '',
      パンツ丈: '',
      'オススメ/kg': '',
    };
    console.log(newData);
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  // useEffect(() => {
  //   let arr = location.pathname.split('/');
  //   if (arr.length >= 5) {
  //     setProductId(arr[4]);
  //     request(`/admin/getProductSizeDescriptionInfo/${arr[4]}`).then((data) => {
  //       console.log(data);
  //       if (data.result) {
  //       }
  //     });
  //   }
  // }, []);
  return (
    <div style={{ width: 1200, margin: '0 auto' }}>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        添加一行
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        tableLayout="fixed"
        pagination={false}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default App;
