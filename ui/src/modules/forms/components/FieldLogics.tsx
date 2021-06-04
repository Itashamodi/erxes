import Button from 'modules/common/components/Button';
// import { FormControl, FormGroup } from 'modules/common/components/form';
import Icon from 'modules/common/components/Icon';
import Info from 'modules/common/components/Info';
import { __ } from 'modules/common/utils';
import {
  IField,
  IFieldAction,
  IFieldLogic
} from 'modules/settings/properties/types';
import { LinkButton } from 'modules/settings/team/styles';
import { ITag } from 'modules/tags/types';
import React, { useEffect, useState } from 'react';
import FieldLogic from './FieldLogic';

type Props = {
  onFieldChange: (
    name: string,
    value: string | boolean | string[] | IFieldLogic[] | IFieldAction[]
  ) => void;
  fields: IField[];
  currentField: IField;
  tags: ITag[];
  type: string;
  onPropertyChange: (selectedField: IField) => void;
};

// const showOptions = [
//   { value: 'show', label: 'Show this field' },
//   { value: 'hide', label: 'Hide this field' },
//   { value: 'tag', label: 'Add a tag'}
// ];

function FieldLogics(props: Props) {
  const { fields, currentField, onFieldChange, type } = props;

  const [logics, setLogics] = useState<IFieldLogic[]>(
    currentField.logics || []
  );

  const [actions, setActions] = useState<IFieldAction[]>(
    currentField.actions || []
  );

  useEffect(() => {
    console.log('use effect logics: ', logics);
    onFieldChange('logics', logics);
  }, [logics, onFieldChange]);

  useEffect(() => {
    console.log('use effect actions');
    onFieldChange('actions', actions);
  }, [actions, onFieldChange]);

  // const onChangeLogicAction = e =>
  //   onFieldChange('logicAction', e.currentTarget.value);

  const onChangeLogic = (name, value, index, isLogic: boolean) => {
    // find current editing one
    if (isLogic) {
      console.log('isLogic: ', isLogic);
      const currentLogic = logics.find((l, i) => i === index);

      // set new value
      if (currentLogic) {
        currentLogic[name] = value;
      }

      setLogics(logics);
      return onFieldChange('logics', logics);
    }

    const currentAction = actions.find((l, i) => i === index);

    // set new value
    if (currentAction) {
      currentAction[name] = value;
    }

    setActions(actions);
    onFieldChange('actions', actions);
  };

  const addLogic = () => {
    setLogics([
      ...logics,
      {
        fieldId: '',
        tempFieldId: '',
        logicOperator: 'is',
        logicValue: '',
        logicAction: 'show'
      }
    ]);
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        fieldId: currentField._id,
        tempFieldId: currentField._id,
        logicOperator: 'is',
        logicValue: '',
        logicAction: 'tag',
        tagIds: undefined,
        stageId: undefined,
        boardId: undefined,
        pipelineId: undefined
      }
    ]);
  };

  const onEnableLogic = () => {
    addLogic();
  };

  const onEnableAction = () => {
    addAction();
  };

  const removeLogic = (index: number) => {
    setLogics(logics.filter((l, i) => i !== index));
  };

  const renderRows = data => {
    return (
      <>
        {data.map((item, index) => (
          <FieldLogic
            key={index}
            fields={fields.filter(field => field._id !== currentField._id)}
            logic={type === 'logic' ? item : null}
            action={type === 'action' ? item : null}
            onChangeLogic={onChangeLogic}
            removeLogic={removeLogic}
            onChangeProperty={props.onPropertyChange}
            index={index}
            tags={props.tags}
            currentField={props.currentField}
            type={type}
          />
        ))}

        <LinkButton onClick={type === 'logic' ? addLogic : addAction}>
          <Icon icon="plus-1" /> {`Add another ${type}`}
        </LinkButton>
      </>
    );
  };

  const renderContent = () => {
    let enabled = false;
    // const { logics = [], actions = [] } = currentField;
    const currentActions = currentField.actions || [];
    const currentLogics = currentField.logics || [];

    let data = logics;

    if (type === 'action' && currentActions.length > 0) {
      enabled = true;
      data = actions;
    }

    if (type === 'logic' && currentLogics.length > 0) {
      enabled = true;
    }

    if (enabled) {
      return renderRows(data);
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
