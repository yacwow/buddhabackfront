import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Input, message, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
interface Props {
  selectedCategories: { title: string; value: string }[];
  setSelectedCategories: React.Dispatch<{ title: string; value: string }[]>;
}
const App: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { treeDataArr } = useModel('global');

  //第一个选择，可以多选的
  const onTreeSelectChange = (newValue: string[]) => {
    setParentTreeSelect(newValue);
    //selectedCategories的值也需要变化 1.如果newvalue里面的value在selectedCategories里面有，则不变化
    let newSelectedCategories = [];
    for (let i = 0; i < newValue.length; i++) {
      let flag = false;
      for (let j = 0; j < selectedCategories.length; j++) {
        if (selectedCategories[j].value === newValue[i]) {
          flag = true;
          newSelectedCategories.push(selectedCategories[j]);
          break;
        }
      }
      if (!flag) {
        newSelectedCategories.push({ title: newValue[i], value: newValue[i] });
      }
    }
    setSelectedCategories(newSelectedCategories);
  };
  const [parentTreeSelect, setParentTreeSelect] = useState<string[]>([]);
  //第二个选择，只能单选的
  const onChildTreeSelectChange = (newValue: string, index: number) => {
    console.log(newValue);
    let newSelectedCategories = structuredClone(selectedCategories);
    newSelectedCategories[index].value = newValue;
    setSelectedCategories(newSelectedCategories);
  };
  //子选项的input的改变
  const handleChildInputChange = (e, index: number) => {
    console.log(e.target.value, index);
    let newSelectedCategories = structuredClone(selectedCategories);
    newSelectedCategories[index].title = e.target.value;
    setSelectedCategories(newSelectedCategories);
  };
  const buildSelectCategory = () => {
    return selectedCategories.map((item, index) => {
      return (
        <div
          key={index}
          style={{ width: 250, marginRight: 20, marginBottom: 20 }}
        >
          <span>选择的类:</span>
          <TreeSelect
            style={{ width: '100%' }}
            value={item.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeDataArr}
            placeholder="Please select"
            multiple={false}
            treeDefaultExpandAll
            onChange={(value) => onChildTreeSelectChange(value, index)}
          />
          <div>
            <span>前端展示的文字:</span>
            <Input
              value={item.title}
              onChange={(e) => handleChildInputChange(e, index)}
            />
          </div>
        </div>
      );
    });
  };
  useEffect(() => {
    let newParentTreeSelect = [];
    for (let i = 0; i < selectedCategories.length; i++) {
      newParentTreeSelect.push(selectedCategories[i].value);
    }
    setParentTreeSelect(newParentTreeSelect);
  }, [selectedCategories]);
  return (
    <div>
      <h3>
        最多展示6个选中的类，如果选择超过6个，则前端随机选取6个展示，
        <br />
        不同类之间选品没做优化，最好为非上下级关系的类
      </h3>
      <div>目前已经选取的类：</div>
      请选择需要展示在购物车maylike组件上展示的类
      {treeDataArr && (
        <TreeSelect
          style={{ width: '100%' }}
          value={parentTreeSelect}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeDataArr}
          placeholder="Please select"
          multiple
          treeDefaultExpandAll
          onChange={(value) => onTreeSelectChange(value)}
        />
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {buildSelectCategory()}
      </div>
      <Button
        type="primary"
        style={{ marginTop: 200 }}
        onClick={() => {
          if (selectedCategories.length <= 2) {
            message.info(
              { content: '需要选择三个以上的类', style: { marginTop: '20vh' } },
              4,
            );
            return;
          }
          for (let i = 0; i < selectedCategories.length; i++) {
            if (
              selectedCategories[i].title === '' ||
              selectedCategories[i].title === undefined
            ) {
              message.info(
                {
                  content: '前端展示的值不能为空',
                  style: { marginTop: '20vh' },
                },
                4,
              );
              return;
            }
          }
          for (let i = 0; i < selectedCategories.length; i++) {
            for (let j = i + 1; j < selectedCategories.length; j++) {
              if (selectedCategories[i].title === selectedCategories[j].title) {
                message.info(
                  {
                    content: '前端展示的值不能相同',
                    style: { marginTop: '20vh' },
                  },
                  4,
                );
                return;
              }
            }
          }
          request('/admin/secure/uploadCartMayLikeData', {
            params: {
              category: JSON.stringify(selectedCategories),
            },
          }).then((data) => {
            if (data.result) {
              message.info(
                {
                  content: '保存成功',
                  style: { marginTop: '20vh' },
                },
                4,
              );
            }
          });
        }}
      >
        提交
      </Button>
    </div>
  );
};
export default App;
