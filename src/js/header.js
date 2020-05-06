const header = () => {
  const Selector = {
    HEADER_BUTTON: `.header__button`,
    HEADER_MENU: `.header__menu`,
    HEADER: `.header`,
  };

  const Classname = {
    HEADER_NO_JS: `header__no-js`,
    HIDDEN: `hidden`,
  };

  class Header {
    constructor() {
      this._header = document.querySelector(Selector.HEADER);
      Header.checkExistence(this._header);
      this._headerMenu = this._header.querySelector(Selector.HEADER_MENU);
      this._headerButton = this._header.querySelector(Selector.HEADER_BUTTON);

      this._activateMenu();
      this._setListeners();
    }

    _activateMenu() {
      this._header.classList.remove(Classname.HEADER_NO_JS);
      this._headerButton.classList.remove(Classname.HIDDEN);
      this._closeMenu();
    }

    _closeMenu() {
      this._headerMenu.classList.add(Classname.HIDDEN);
    }

    _openMenu() {
      this._headerMenu.classList.remove(Classname.HIDDEN);
    }

    _isMenuOpened() {
      return !this._headerMenu.classList.contains(Classname.HIDDEN);
    }

    _setListeners() {
      this._headerButton.addEventListener(`click`, () => {
        this._isMenuOpened() ? this._closeMenu() : this._openMenu();
      });
    }

    static checkExistence(element) {
      if (!document.contains(element)) {
        throw new Error(`element doesn't exist`);
      }
    }
  }

  try {
    new Header();
  } catch (ex) {
    if (ex.message === `element doesn't exist`) {
      return null;
    }
    throw ex;
  }
};

export default header;
