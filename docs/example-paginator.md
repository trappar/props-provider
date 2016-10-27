# Example - Paginator

In this example we'll create a Paginator component using Bootstrap 4 which leave rendering the paginated elements and actual paginator to its children.  

### Component

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
  children: PropsProvider.PropType,
  perPage: React.PropTypes.number,
};
```

### Render

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

### Output

![paginator](https://cloud.githubusercontent.com/assets/525726/19762335/7286c29a-9bee-11e6-8a6b-7f448ea7d467.gif)

Great! Done, or are we? What if we want to make this Paginator not assume that you're using Bootstrap 4?

## Refactored Paginator with PageChanger extracted

#### Paginator

```jsx
import React from 'react';
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
    const { items, children, perPage, pageChanger } = this.props;

    let pages = [];
    for (let i = 0; i < items.length; i += perPage) {
      pages.push(items.slice(i, i + perPage));
    }

    const canPrevious = this.state.page > 0;
    const canNext = this.state.page < pages.length - 1;

    return (
      <PropsProvider
        pagedItems={pages.length > 0 ? pages[this.state.page] : false}
        pagination={pages.length - 1 > 0 && (
          <PropsProvider
            nextPage={() => canNext && this.setPage(this.state.page + 1)}
            previousPage={() => canPrevious && this.setPage(this.state.page - 1)}
            setPage={(page) => this.setPage(page)}
            canNext={canNext}
            canPrevious={canPrevious}
            pages={pages}
            currentPage={this.state.page}>
            {pageChanger}
          </PropsProvider>
        )}>
        {children}
      </PropsProvider>
    );
  }
}
Paginator.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
  pageChanger: PropsProvider.PropType,
  perPage: React.PropTypes.number,
  children: PropsProvider.PropType
};
Paginator.defaultProps = {
  perPage: 10
};
```

#### PageChanger

```jsx
import React from 'react';
import classNames from 'classnames';

export default function BootstrapPageChanger({ nextPage, previousPage, setPage, canNext, canPrevious, pages, currentPage }) {
  return (
    <nav>
      <ul className="pagination">
        <li className={classNames('page-item', { disabled: !canPrevious })}>
          <a href="#" className="page-link"
             onClick={previousPage}>
            <span>&laquo;</span>
          </a>
        </li>
        {pages.map((items, page) => (
          <li key={page} className={classNames('page-item', { active: currentPage === page })}>
            <a href="#" className="page-link" onClick={() => setPage(page)}>
              {page + 1}
            </a>
          </li>
        ))}
        <li className={classNames('page-item', { disabled: !canNext })}>
          <a href="#" className="page-link" onClick={nextPage}>
            <span>&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
BootstrapPageChanger.propTypes = {
  nextPage: React.PropTypes.func,
  previousPage: React.PropTypes.func,
  setPage: React.PropTypes.func,
  canNext: React.PropTypes.bool,
  canPrevious: React.PropTypes.bool,
  pages: React.PropTypes.array,
  currentPage: React.PropTypes.number
};
```

### Rendering

```jsx
<Paginator pageChanger={<BootstrapPageChanger/>} items={'abcdefghijklmnopqrstuvwxyz.split('')}>
  {({ pagedItems, pagination }) => {
    return (
      <div>
        {pagination}
        <ul>
          {pagedItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }}
</Paginator>
```

## Conclusion

The first Paginator and the refactored one are both valid solutions to this issue, the focus is just different.

The first case is opinionated. You should use this method in an application where you know you'll be using Bootstrap 4 and that will be the extent of its use.

The second case would be more ideal if you were planning on making this a general purpose component that could be used regardless of CSS framework. Perhaps in your Paginator library you want to include adapter components to support a multitude of different Paginator styles. This leaves the Paginator open for extension.

Which approach you choose should depend on the scope of your component, but in general it's best to start with the most opinionated version possible and then refactor for additional extension only when you find that you can not accomplish a goal without doing so.