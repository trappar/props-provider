import React from 'react';
import { mount } from 'enzyme';
import PropsProvider from '../PropsProvider';

const PassProp = props => (
  <PropsProvider testProp="test">
    {props.children}
  </PropsProvider>
);
PassProp.propTypes = {
  children: PropsProvider.PropType
};

const Element = ({testProp}) => <div>{testProp}</div>;

test('Passes prop to function', () => {
  expect(
    mount((
      <PassProp>
        {({ testProp }) => <div>{testProp}</div>}
      </PassProp>
    )).text()
  ).toBe('test');
});

test('Passes prop to React element(s)', () => {
  expect(
    mount((
      <PassProp><Element /></PassProp>
    )).text()
  ).toBe('test');

  expect(
    mount((
      <PassProp>
        <Element />
        <Element />
      </PassProp>
    )).text()
  ).toBe('testtest');
});

test('Passes props to multiple children of different types', () => {
  expect(
    mount((
      <PassProp>
        {({ testProp }) => <div>{testProp}</div>}
        <Element />
        {false}
      </PassProp>
    )).text()
  ).toBe('testtest');
});

test('Props passed to React elements can be overridden', () => {
  expect(
    mount((
      <PassProp><Element testProp="notTest"/></PassProp>
    )).text()
  ).toBe('notTest');
});

test('Passes prop to an Array of functions', () => {
  expect(
    mount((
      <PassProp>
        {['a', 'b'].map(item => ({ testProp }) => <div>{item}{testProp}</div>)}
      </PassProp>
    )).text()
  ).toBe('atestbtest');
});

test('Passes prop to an Array of React elements', () => {
  expect(
    mount((
      <PassProp>
        {['a', 'b'].map((item, i) => <Element key={i}/>)}
      </PassProp>
    )).text()
  ).toBe('testtest');
});

test('Passes props deeply', () => {
  expect(
    mount((
      <PassProp>
        {['a', 'b'].map(item => ['c', 'd'].map(innerItem => ({ testProp }) => <div>{item}{innerItem}{testProp} </div>))}
      </PassProp>
    )).text()
  ).toBe('actest adtest bctest bdtest ');
});

test('Fails when invalid types are supplied', () => {
  const mockConsole = jest.fn();
  window.console = { error: mockConsole };

  expect(() => {
    mount((
      <PassProp>
        {["text nodes can't be given props"]}
      </PassProp>
    ))
  }).toThrow();

  const warning = mockConsole.mock.calls[0][0];
  expect(warning).toContain('children prop of PassProp');
  expect(warning).toContain('\'string\' was found in \'children[0]\'');
});