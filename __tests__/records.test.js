const {
  addRecord,
  recordCount,
} = require('../public/scripts/records');

beforeEach(() => {
  // simple DOM setup
  document.body.innerHTML = `
    <input id="data-parking-pass-date" />
    <input id="data-member-name" />
    <input id="data-member-address" />
    <input id="data-make" />
    <input id="data-model" />
    <input id="data-license-plate" />
    <div id="tbl-records"><tbody></tbody></div>
    <span id="recordcount"></span>
  `;

  global.$ = (selector) => {
    const elements = Array.from(document.querySelectorAll(selector));
    return {
      val(value) {
        if (value === undefined) return elements[0]?.value;
        elements.forEach((el) => (el.value = value));
        return this;
      },
      html(value) {
        if (value === undefined) return elements[0]?.innerHTML;
        elements.forEach((el) => (el.innerHTML = value));
        return this;
      },
      append(value) {
        elements.forEach((el) => el.insertAdjacentHTML('beforeend', value));
        return this;
      },
      button() {
        return this;
      },
      buttonMarkup() {
        return this;
      },
      table() {
        return this;
      },
      attr(name, value) {
        if (value === undefined) return elements[0]?.getAttribute(name);
        elements.forEach((el) => el.setAttribute(name, value));
        return this;
      },
    };
  };

  global.getCurrentDateFormatted = () => '2021-01-01';
  global.alert = jest.fn();
  localStorage.clear();
});

describe('addRecord', () => {
  test('returns true when a spot is available', () => {
    document.getElementById('data-parking-pass-date').value = '2021-01-01';
    document.getElementById('data-member-name').value = 'John';
    document.getElementById('data-member-address').value = '123 St';
    document.getElementById('data-make').value = 'Ford';
    document.getElementById('data-model').value = 'Focus';
    document.getElementById('data-license-plate').value = 'ABC123';

    const result = addRecord();
    expect(result).toBe(true);
    const records = JSON.parse(localStorage.getItem('tbRecords'));
    expect(records.length).toBe(1);
  });

  test('returns false when spots are full', () => {
    const full = new Array(35).fill({ Date: '2021-01-01' });
    localStorage.setItem('tbRecords', JSON.stringify(full));

    document.getElementById('data-parking-pass-date').value = '2021-01-01';
    document.getElementById('data-member-name').value = 'John';
    document.getElementById('data-member-address').value = '123 St';
    document.getElementById('data-make').value = 'Ford';
    document.getElementById('data-model').value = 'Focus';
    document.getElementById('data-license-plate').value = 'ABC123';

    const result = addRecord();
    expect(result).toBe(false);
    const records = JSON.parse(localStorage.getItem('tbRecords'));
    expect(records.length).toBe(35);
  });
});

describe('recordCount', () => {
  test('updates DOM with remaining spots', () => {
    const records = new Array(5).fill({ Date: '2021-01-01' });
    localStorage.setItem('tbRecords', JSON.stringify(records));
    const remaining = recordCount();
    expect(remaining).toBe(30);
    expect(document.getElementById('recordcount').innerHTML).toBe('30');
  });
});
