import Button from 'modules/common/components/Button';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'modules/common/components/form';
import DateControl from 'modules/common/components/form/DateControl';
import { Formgroup } from 'modules/common/components/form/styles';
import { __ } from 'modules/common/utils';
import { IField, IFieldLogic } from 'modules/settings/properties/types';
import SelectTags from 'modules/tags/containers/SelectTags';
import { ITag } from 'modules/tags/types';
import React, { useState } from 'react';
import {
  dateTypeChoices,
  numberTypeChoices,
  stringTypeChoices
} from '../constants';
import { DateWrapper, LogicItem, LogicRow, RowFill, RowSmall } from '../styles';
// import BoardSelect from 'modules/boards/containers/BoardSelect';
// import CardSelect from 'modules/boards/components/portable/CardSelect';
import BoardItemSelectContainer from '../containers/BoardItemSelect';
import { FlexRow } from '../styles';
import Toggle from 'modules/common/components/Toggle';
import Select from 'react-select-plus';

type Props = {
  onChangeLogic: (
    name: string,
    value: string | number | Date,
    index: number,
    title?: string
  ) => void;
  logic: IFieldLogic;
  fields: IField[];
  index: number;
  removeLogic: (index: number) => void;
  fetchCards?: (stageId: string, callback: (cards: any) => void) => void;
  tags: ITag[];
  currentField: IField;
  type: string;
};

const logicOptions = [
  { value: 'show', label: 'Show this field' },
  { value: 'hide', label: 'Hide this field' }
];

const actionOptions = [
  { value: 'tag', label: 'Tag this contact' },
  { value: 'deal', label: 'Create a deal' },
  { value: 'task', label: 'Create a task' },
  { value: 'ticket', label: 'Create a ticket' }
];

function FieldLogic(props: Props) {
  const { fields, logic, onChangeLogic, removeLogic, index, type } = props;

  const getSelectedField = () => {
    return fields.find(
      field => field._id === logic.fieldId || field._id === logic.tempFieldId
    );
  };

  const getOperatorOptions = () => {
    let selectedField = getSelectedField();

    if (type === 'action') {
      selectedField = props.currentField;
    }

    if (selectedField && selectedField.validation) {
      if (selectedField.validation === 'number') {
        return numberTypeChoices;
      }

      if (selectedField.validation.includes('date')) {
        return dateTypeChoices;
      }
    }

    return stringTypeChoices;
  };

  const onChangeFieldId = e => {
    const value = e.target.value;
    onChangeLogic('fieldId', '', index);

    if (props.type === 'action') {
      onChangeLogic('fieldId', 'self', index);
    }

    onChangeLogic(
      value.startsWith('tempId') ? 'tempFieldId' : 'fieldId',
      value,
      index
    );

    const operators = getOperatorOptions();
    onChangeLogic('logicOperator', operators[1].value, index);
  };

  const onChangeLogicOperator = e => {
    onChangeLogic('logicOperator', e.target.value, index);
  };

  const onChangeLogicValue = e => {
    onChangeLogic('logicValue', e.target.value, index);
  };

  const onDateChange = value => {
    onChangeLogic('logicValue', value, index);
  };

  const remove = () => {
    removeLogic(index);
  };

  const onChangeLogicAction = e => {
    onChangeLogic('boardId', '', index);
    onChangeLogic('pipelineId', '', index);
    onChangeLogic('stageId', '', index);
    onChangeLogic('itemId', '', index);
    onChangeLogic('itemName', '', index);
    onChangeLogic('logicAction', e.currentTarget.value, index);
  };

  const onChangeTags = values => {
    onChangeLogic('tagIds', values, index);
  };

  const renderLogicValue = () => {
    let selectedField = getSelectedField();

    if (type === 'action') {
      selectedField = props.currentField;
    }

    if (selectedField) {
      if (
        selectedField.type === 'check' ||
        selectedField.type === 'select' ||
        selectedField.type === 'radio'
      ) {
        return (
          <FormControl
            componentClass="select"
            defaultValue={logic.logicValue}
            name="logicValue"
            onChange={onChangeLogicValue}
          >
            <option value="" />
            {selectedField.options &&
              selectedField.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </FormControl>
        );
      }

      if (['date', 'datetime'].includes(selectedField.validation || '')) {
        return (
          <DateWrapper>
            <DateControl
              placeholder={__('pick a date')}
              value={logic.logicValue}
              timeFormat={
                selectedField.validation === 'datetime' ? true : false
              }
              onChange={onDateChange}
            />
          </DateWrapper>
        );
      }

      if (selectedField.validation === 'number') {
        return (
          <FormControl
            defaultValue={logic.logicValue}
            name="logicValue"
            onChange={onChangeLogicValue}
            type={'number'}
          />
        );
      }

      return (
        <FormControl
          defaultValue={logic.logicValue}
          name="logicValue"
          onChange={onChangeLogicValue}
        />
      );
    }

    return null;
  };

  const renderTags = () => {
    if (logic.logicAction !== 'tag' || type === 'logic') {
      return null;
    }

    return (
      <FormGroup>
        <SelectTags
          type={'customer'}
          onChange={onChangeTags}
          defaultValue={logic.tagIds || []}
        />
      </FormGroup>
    );
  };

  const [properties, setProperties] = useState<IField[]>([]);
  const [selectedProperties, setSelectProperties] = useState<IField[]>([]);

  const renderBoardItemSelect = () => {
    if (!['task', 'deal', 'ticket'].includes(logic.logicAction)) {
      return null;
    }

    const onChangeCardSelect = (name, cardId) => {
      onChangeLogic('itemId', cardId, index);
      onChangeLogic('itemName', name, index);
    };

    const onFetchProperties = customProperties => {
      setProperties(customProperties.fields);
    };

    return (
      <BoardItemSelectContainer
        type={logic.logicAction}
        boardId={logic.boardId}
        pipelineId={logic.pipelineId}
        stageId={logic.stageId}
        onChangeCard={onChangeCardSelect}
        onFetchProperties={onFetchProperties}
      />
    );
  };

  const renderFields = () => {
    if (type === 'action') {
      return null;
    }

    let options = fields;
    if (!['show', 'hide'].includes(logic.logicAction)) {
      const { currentField } = props;
      if (!currentField.text) {
        currentField.text = 'Current field';
      }

      if (0 > options.findIndex(e => e._id === currentField._id)) {
        options.unshift(currentField);
      }
    }

    options = Array.from(new Set(options));
    return (
      <FormGroup>
        <ControlLabel>Fields</ControlLabel>
        <FormControl
          componentClass="select"
          value={logic.fieldId || logic.tempFieldId}
          name="fieldId"
          onChange={onChangeFieldId}
        >
          <option value="" />

          {options.map(field => (
            <option key={field._id} value={field._id}>
              {field.text}
            </option>
          ))}
        </FormControl>
      </FormGroup>
    );
  };

  const [propertiesEnabled, setEnabled] = useState(false);

  const renderProperties = () => {
    if (!logic.pipelineId) {
      return null;
    }
    const onChange = e => {
      setEnabled(e.target.checked ? true : false);
    };

    const onSelectProperty = options => {
      setSelectProperties(options);
    };

    return (
      <>
        <FormGroup>
          <FlexRow>
            <ControlLabel htmlFor="description">
              {__('Select custom properties as form field')}
            </ControlLabel>
            <Toggle
              defaultChecked={propertiesEnabled}
              icons={{
                checked: <span>Yes</span>,
                unchecked: <span>No</span>
              }}
              onChange={onChange}
            />
          </FlexRow>
        </FormGroup>
        {propertiesEnabled ? (
          <FormGroup>
            <ControlLabel>Properties</ControlLabel>
            <p>
              {'Following properties will be added as field into this form.'}
            </p>
            <Select
              placeholder={__('Select properties')}
              onChange={onSelectProperty}
              value={selectedProperties}
              options={
                properties &&
                properties.map(e => ({ label: e.text, value: e._id }))
              }
              multi={true}
            />
          </FormGroup>
        ) : null}
      </>
    );
  };

  return (
    <LogicItem>
      <LogicRow>
        <RowFill>
          <FormGroup>
            <ControlLabel>Actions</ControlLabel>
            <FormControl
              componentClass="select"
              defaultValue={logic.logicAction}
              name="logicAction"
              options={type === 'logic' ? logicOptions : actionOptions}
              onChange={onChangeLogicAction}
            />
          </FormGroup>

          {renderFields()}
          {renderTags()}
          {renderBoardItemSelect()}

          <LogicRow>
            <RowSmall>
              <ControlLabel>Operator</ControlLabel>
              <FormControl
                componentClass="select"
                defaultValue={logic.logicOperator}
                name="logicOperator"
                options={getOperatorOptions()}
                onChange={onChangeLogicOperator}
              />
            </RowSmall>
            <Formgroup>
              <ControlLabel>Value</ControlLabel>
              <RowFill>{renderLogicValue()}</RowFill>
            </Formgroup>
          </LogicRow>
          {renderProperties()}
        </RowFill>
        <Button onClick={remove} btnStyle="danger" icon="times" />
      </LogicRow>
    </LogicItem>
  );
}

export default FieldLogic;
