import Button from 'modules/common/components/Button';
// import { FormControl, FormGroup } from 'modules/common/components/form';
import Icon from 'modules/common/components/Icon';
import Info from 'modules/common/components/Info';
import { __ } from 'modules/common/utils';
import { IField, IFieldLogic } from 'modules/settings/properties/types';
import { LinkButton } from 'modules/settings/team/styles';
import { ITag } from 'modules/tags/types';
import React, { useEffect, useState } from 'react';
import FieldLogic from './FieldLogic';

type Props = {
  onFieldChange: (
    name: string,
    value: string | boolean | string[] | IFieldLogic[]
  ) => void;
  fields: IField[];
  currentField: IField;
  tags: ITag[];
  type: string;
};

// const showOptions = [
//   { value: 'show', label: 'Show this field' },
//   { value: 'hide', label: 'Hide this field' },
//   { value: 'tag', label: 'Add a tag'}
// ];

function FieldLogics(props: Props) {
  const { fields, currentField, onFieldChange, type } = props;

  const [logics, setLogics] = useState<IFieldLogic[]>(
    (currentField.logics || []).map(
      ({
        fieldId,
        tempFieldId,
        logicOperator,
        logicValue,
        logicAction,
        tagIds,
        stageId,
        boardId,
        pipelineId,
        itemId,
        itemName
      }) => {
        return {
          fieldId,
          tempFieldId,
          logicOperator,
          logicValue,
          logicAction,
          tagIds,
          stageId,
          boardId,
          pipelineId,
          itemId,
          itemName
        };
      }
    )
  );

  useEffect(() => {
    console.log('useEffect called: ', type);
    console.log('useEffect: ', logics);

    // setLogics(logics.filter(e => ['show', 'hide'].includes(e.logicAction)));

    // if (type === 'action') {
    //   setLogics(
    //     logics.filter(e =>
    //       ['tag', 'deal', 'ticket', 'task'].includes(e.logicAction)
    //     )
    //   );
    // }

    onFieldChange('logics', logics);
  }, [logics, onFieldChange]);

  // const onChangeLogicAction = e =>
  //   onFieldChange('logicAction', e.currentTarget.value);

  const onChangeLogic = (name, value, index) => {
    // find current editing one
    const currentLogic = logics.find((l, i) => i === index);

    // set new value
    if (currentLogic) {
      currentLogic[name] = value;
    }

    setLogics(logics);
    onFieldChange('logics', logics);
  };

  const addLogic = () => {
    let logicAction = 'show';

    if (type === 'action') {
      logicAction = 'tag';
    }

    setLogics([
      ...(currentField.logics || []),
      {
        fieldId: '',
        tempFieldId: '',
        logicOperator: 'is',
        logicValue: '',
        logicAction,
        tagIds: undefined,
        stageId: undefined,
        boardId: undefined,
        pipelineId: undefined
      }
    ]);
  };

  const onEnableLogic = () => {
    addLogic();
    onFieldChange('logicAction', 'show');
  };

  const onEnableAction = () => {
    addLogic();
    onFieldChange('logicAction', 'tag');
  };

  const removeLogic = (index: number) => {
    setLogics(logics.filter((l, i) => i !== index));
  };

  const renderContent = () => {
    let enabled = false;

    let hasLogic = false;
    let hasAction = false;

    for (const logic of currentField.logics || []) {
      if (['show', 'hide'].includes(logic.logicAction)) {
        hasLogic = true;
      }

      if (['tag', 'deal', 'task', 'ticket'].includes(logic.logicAction)) {
        hasAction = true;
      }
    }

    if (type === 'action' && hasAction) {
      enabled = true;
    }

    if (type === 'logic' && hasLogic) {
      enabled = true;
    }

    if (enabled) {
      return (
        <>
          {/* <FormGroup>
            <FormControl
              componentClass="select"
              defaultValue={currentField.logicAction}
              name="logicAction"
              options={showOptions}
              onChange={onChangeLogicAction}
            />
          </FormGroup> */}
          {logics.map((logic, index) => (
            <FieldLogic
              key={index}
              fields={fields.filter(field => field._id !== currentField._id)}
              logic={logic}
              onChangeLogic={onChangeLogic}
              removeLogic={removeLogic}
              index={index}
              tags={props.tags}
              currentField={props.currentField}
              type={type}
            />
          ))}

          <LinkButton onClick={addLogic}>
            <Icon icon="plus-1" /> {`Add another ${type}`}
          </LinkButton>
        </>
      );
    }

    return (
      <Button
        block={true}
        uppercase={false}
        btnStyle="success"
        icon="check-circle"
        onClick={type === 'logic' ? onEnableLogic : onEnableAction}
      >
        {`Enable ${type}`}
      </Button>
    );
  };

  return (
    <>
      <Info>
        {__(
          'Create rules to show or hide this element depending on the values of other fields'
        )}
      </Info>
      {renderContent()}
    </>
  );
}

export default FieldLogics;
