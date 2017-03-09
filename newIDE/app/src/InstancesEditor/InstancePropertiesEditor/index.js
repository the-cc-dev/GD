import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import mapFor from '../../Utils/MapFor';

export default class InstancePropertiesEditor extends Component {
  constructor() {
    super();

    this.schema = [
      {
        name: 'Object name',
        valueType: 'string',
        disabled: true,
        getValue: instance => instance.getObjectName(),
        setValue: (instance, newValue) => instance.setObjectName(newValue),
      },
      {
        name: 'X',
        valueType: 'number',
        getValue: instance => instance.getX(),
        setValue: (instance, newValue) => instance.setX(newValue),
      },
      {
        name: 'Y',
        valueType: 'number',
        getValue: instance => instance.getY(),
        setValue: (instance, newValue) => instance.setY(newValue),
      },
      {
        name: 'Angle',
        valueType: 'number',
        getValue: instance => instance.getAngle(),
        setValue: (instance, newValue) => instance.setAngle(newValue),
      },
      {
        name: 'Z Order',
        valueType: 'number',
        getValue: instance => instance.getZOrder(),
        setValue: (instance, newValue) => instance.setZOrder(newValue),
      },
      {
        name: 'Layer',
        valueType: 'string',
        getValue: instance => instance.getLayer(),
        setValue: (instance, newValue) => instance.setLayer(newValue),
      },
      {
        name: 'Locked',
        valueType: 'boolean',
        getValue: instance => instance.isLocked(),
        setValue: (instance, newValue) => instance.setLocked(newValue),
      },
      {
        name: 'Custom size',
        children: [
          {
            name: 'Enabled?',
            valueType: 'boolean',
            getValue: instance => instance.hasCustomSize(),
            setValue: (instance, newValue) =>
              instance.setHasCustomSize(newValue),
          },
          {
            name: 'Width',
            valueType: 'number',
            getValue: instance => instance.getCustomWidth(),
            setValue: (instance, newValue) => instance.setCustomWidth(newValue),
          },
          {
            name: 'Height',
            valueType: 'number',
            getValue: instance => instance.getCustomHeight(),
            setValue: (instance, newValue) =>
              instance.setCustomHeight(newValue),
          },
        ],
      },
    ];
  }

  _getFieldValue(instances, field, defaultValue) {
    let value = field.getValue(instances[0]);
    for (var i = 1; i < instances.length; ++i) {
      if (value !== field.getValue(instances[i])) {
        if (typeof defaultValue !== 'undefined') value = defaultValue;
        break;
      }
    }

    return value;
  }

  _renderEditField = field => {
    if (field.valueType === 'boolean') {
      return (
        <Checkbox
          label={field.name}
          key={field.name}
          checked={this._getFieldValue(this.props.instances, field)}
          onCheck={(event, newValue) => {
            this.props.instances.forEach(i => field.setValue(i, !!newValue));
            this.props.onInstancesModified(this.props.instances);
          }}
          disabled={field.disabled}
        />
      );
    } else if (field.valueType === 'number') {
      return (
        <TextField
          value={this._getFieldValue(this.props.instances, field)}
          key={field.name}
          floatingLabelText={field.name}
          floatingLabelFixed={true}
          onChange={(event, newValue) => {
            this.props.instances.forEach(i =>
              field.setValue(i, parseFloat(newValue) || 0));
            this.props.onInstancesModified(this.props.instances);
          }}
          type="number"
          fullWidth={true}
          disabled={field.disabled}
        />
      );
    } else {
      return (
        <TextField
          value={this._getFieldValue(
            this.props.instances,
            field,
            '(Multiple values)'
          )}
          key={field.name}
          floatingLabelText={field.name}
          floatingLabelFixed={true}
          onChange={(event, newValue) => {
            this.props.instances.forEach(i =>
              field.setValue(i, newValue || ''));
            this.props.onInstancesModified(this.props.instances);
          }}
          fullWidth={true}
          disabled={field.disabled}
        />
      );
    }
  };

  _renderFields(schema) {
    return schema.map(field => {
      if (field.getValue) return this._renderEditField(field);
      if (field.children) {
        return (
          <div key={field.name}>
            <Subheader>{field.name}</Subheader>
            <div style={{ marginLeft: 15 }}>
              {this._renderFields(field.children)}
            </div>
          </div>
        );
      }

      return null;
    });
  }

  render() {
    const { project, layout, instances } = this.props;
    if (!instances || !instances.length) return null;

    //TODO: multiple instances support
    const properties = instances[0].getCustomProperties(project, layout);
    const propertyNames = properties.keys();
    const propertyFields = mapFor(0, propertyNames.size(), i => {
      const name = propertyNames.at(i);
      const property = properties.get(name);
      const valueType = property.getType().toLowerCase();

      return {
        name,
        valueType,
        getValue: instance => {
          // Instance custom properties are always stored as string, cast them if necessary
          const rawValue = instance
            .getCustomProperties(project, layout)
            .get(name)
            .getValue();
          if (valueType === 'boolean') {
            return rawValue === 'true';
          } else if (valueType === 'number') {
            return parseFloat(rawValue);
          }

          return rawValue;
        },
        setValue: (instance, newValue) => {
          // Instance custom properties are always stored as string, cast them if necessary
          let value;
          if (typeof newValue === 'boolean') {
            value = newValue ? '1' : '0';
          } else {
            value = '' + newValue;
          }

          instance.updateCustomProperty(name, value, project, layout);
        },
      };
    });

    return (
      <div
        style={{ padding: 10, overflowY: 'scroll' }}
        key={instances.map(instance => '' + instance.ptr).join(';')}
      >
        {this._renderFields(this.schema.concat(propertyFields))}
      </div>
    );
  }
}