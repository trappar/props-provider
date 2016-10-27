# Example - Paginator

In this example we'll create a Paginator component using Bootstrap 4 which leave rendering the paginated elements and actual paginator to its children.  

## Component

```jsx
import React from 'react';
import classNames from 'classnames';
import PropsProvider from 'props-provider';

export default class Paginator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 0 };
  }

  setPage(page) {
    this.setState({ page });
  }

  render() {
    const { items, children, perPage } = this.props;

    let pages = [];
    for (let i = 0; i < items.length; i += perPage) {
      pages.push(items.slice(i, i + perPage));
    }

    const canPrevious = this.state.page > 0;
    const canNext = this.state.page < pages.length - 1;

    const pagedItems = pages.length > 0 ? pages[this.state.page] : false;
    const pagination = pages.length - 1 > 0 && (
        <nav>
          <ul className="pagination">
            <li className={classNames('page-item', { disabled: !canPrevious })}>
              <a href="#" className="page-link"
                 onClick={() => this.setPage(this.state.page-1)}>
                <span>&laquo;</span>
              </a>
            </li>
            {pages.map((node, i) => (
              <li key={i} className={classNames('page-item', { active: this.state.page === i })}>
                <a href="#" className="page-link" onClick={() => this.setPage(i)}>
                  {i + 1}
                </a>
              </li>
            ))}
            <li className={classNames('page-item', { disabled: !canNext })}>
              <a href="#" className="page-link" onClick={() => canNext && this.setPage(this.state.page+1)}>
                <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      );

    return <PropsProvider pagedItems={pagedItems} pagination={pagination}>{children}</PropsProvider>;
  }
}
Paginator.propTypes = {
  items: React.PropTypes.array.isRequired,
  children: React.PropTypes.element.isRequired,
  perPage: React.PropTypes.number,
};
```

## Render

```jsx
<Paginator items={'abcdefghijklmnopqrstuvwxyz'.split('')}>
  {({ pagedItems, pagination }) => (
    <div>
      {pagination}
      <ul>
        {pagedItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</Paginator>
```

## Output

![paginator](https://cloud.githubusercontent.com/assets/525726/19762335/7286c29a-9bee-11e6-8a6b-7f448ea7d467.gif)