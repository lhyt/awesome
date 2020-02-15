String.prototype.render = function(context) {
  const tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

  return this.replace(tokenReg, function(word, slash1, token, slash2) {
    if (slash1 || slash2) {
      return word.replace('\\', '');
    }

    const constiables = token.replace(/\s/g, '').split('.');
    let currentObject = context;
    let i, length, constiable;

    for (i = 0, length = constiables.length; i < length; ++i) {
      constiable = constiables[i];
      currentObject = currentObject[constiable];
      if (currentObject === undefined || currentObject === null) return '';
    }
    return currentObject;
  });
};

const re = /x/;
console.log(re);
re.toString = function() {
  showMessage('发现你打开了控制台，你可能是前端工程师？', 5000, true);
  return '';
};

document.addEventListener('copy', () => {
  showMessage('发现你复制了，好东西记得分享给小伙伴哦', 5000, true);
});

//window.hitokotoTimer = window.setInterval(showHitokoto,30000);
/* 检测用户活动状态，并在空闲时 定时显示一言 */
let getActed = false;
window.hitokotoTimer = 0;
let hitokotoInterval = false;

document.addEventListener('mousemove', () => {
  getActed = true;
});

document.addEventListener('keydown', () => {
  getActed = true;
});
setInterval(function() {
  if (!getActed) ifActed();
  else elseActed();
}, 1000);

function ifActed() {
  if (!hitokotoInterval) {
    hitokotoInterval = true;
    hitokotoTimer = window.setInterval(showHitokoto, 30000);
  }
}

function elseActed() {
  getActed = hitokotoInterval = false;
  window.clearInterval(hitokotoTimer);
}

function showHitokoto() {
  /* 增加 hitokoto.cn API */
  $.getJSON('https://v1.hitokoto.cn', function(result) {
    let text =
      '这句一言来自 <span style="color:#0099cc;">『{source}』</span>，是 <span style="color:#0099cc;">{creator}</span> 在 hitokoto.cn 投稿的。';
    text = text.render({ source: result.from, creator: result.creator });
    showMessage(result.hitokoto, 5000);
    window.setTimeout(function() {
      showMessage(text, 3000);
    }, 5000);
  });
}

function showMessage(text, timeout, flag) {
  if (
    flag ||
    sessionStorage.getItem('waifu-text') === '' ||
    sessionStorage.getItem('waifu-text') === null
  ) {
    if (Array.isArray(text))
      text = text[Math.floor(Math.random() * text.length + 1) - 1];
    //console.log(text);

    if (flag) sessionStorage.setItem('waifu-text', text);

    $('.waifu-tips').stop();
    $('.waifu-tips')
      .html(text)
      .fadeTo(200, 1);
    if (timeout === undefined) timeout = 5000;
    hideMessage(timeout);
  }
}

function hideMessage(timeout) {
  $('.waifu-tips')
    .stop()
    .css('opacity', 1);
  if (timeout === undefined) timeout = 5000;
  window.setTimeout(function() {
    sessionStorage.removeItem('waifu-text');
  }, timeout);
  $('.waifu-tips')
    .delay(timeout)
    .fadeTo(200, 0);
}

function firstMessage() {
  let text;
  //const SiteIndexUrl = 'https://www.fghrsh.net/';  // 手动指定主页
  const SiteIndexUrl =
    window.location.protocol + '//' + window.location.hostname + '/'; // 自动获取主页

  if (window.location.href == SiteIndexUrl) {
    // 如果是主页
    const now = new Date().getHours();
    if (now > 23 || now <= 5) {
      text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
    } else if (now > 5 && now <= 7) {
      text = '早上好！一日之计在于晨，美好的一天就要开始了';
    } else if (now > 7 && now <= 11) {
      text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
    } else if (now > 11 && now <= 14) {
      text = '中午了，工作了一个上午，现在是午餐时间！';
    } else if (now > 14 && now <= 17) {
      text = '午后很容易犯困呢，今天的运动目标完成了吗？';
    } else if (now > 17 && now <= 19) {
      text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
    } else if (now > 19 && now <= 21) {
      text = '晚上好，今天过得怎么样？';
    } else if (now > 21 && now <= 23) {
      text = '已经这么晚了呀，早点休息吧，晚安~';
    } else {
      text = '嗨~ 快来逗我玩吧！';
    }
  } else {
    if (document.referrer !== '') {
      const referrer = document.createElement('a');
      referrer.href = document.referrer;
      const domain = referrer.hostname.split('.')[1];
      if (window.location.hostname == referrer.hostname) {
        text =
          '欢迎阅读<span style="color:#0099cc;">『' +
          document.title.split(' - ')[0] +
          '』</span>';
      } else if (domain == 'baidu') {
        text =
          'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' +
          referrer.search.split('&wd=')[1].split('&')[0] +
          '</span> 找到的我吗？';
      } else if (domain == 'so') {
        text =
          'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' +
          referrer.search.split('&q=')[1].split('&')[0] +
          '</span> 找到的我吗？';
      } else if (domain == 'google') {
        text =
          'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' +
          document.title.split(' - ')[0] +
          '』</span>';
      } else {
        text =
          'Hello! 来自 <span style="color:#0099cc;">' +
          referrer.hostname +
          '</span> 的朋友';
      }
    } else {
      text =
        '欢迎阅读<span style="color:#0099cc;">『' +
        document.title.split(' - ')[0] +
        '』</span>';
    }
  }
  showMessage(text, 6000);
}

function initModel(waifuPath, cb = () => {}, mid) {
  if (waifuPath === undefined) waifuPath = '';
  const modelId = mid || 3;
  const modelTexturesId = mid === 3 ? 0 : Math.floor(Math.random() * 3);
  loadModel(modelId, modelTexturesId, () => {
    cb();
    firstMessage();
  });

  fetch(`${waifuPath}waifu-tips.json`).then(r => {
    r.json().then(result => {
      result.click.forEach(tips => {
        const filters = document.querySelector(tips.selector);
        document.addEventListener('click', e => {
          if (filters === e.target) {
            let text = tips.text;
            if (Array.isArray(tips.text))
              text =
                tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
            text = text.render({ text });
            showMessage(text, 3000);
          }
        });
      });
      result.seasons.forEach(tips => {
        const now = new Date();
        const after = tips.date.split('-')[0];
        const before = tips.date.split('-')[1] || after;

        if (
          after.split('/')[0] <= now.getMonth() + 1 &&
          now.getMonth() + 1 <= before.split('/')[0] &&
          after.split('/')[1] <= now.getDate() &&
          now.getDate() <= before.split('/')[1]
        ) {
          let text = tips.text;
          if (Array.isArray(tips.text))
            text =
              tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
          text = text.render({ year: now.getFullYear() });
          showMessage(text, 6000, true);
        }
      });
    });
  });
}

function loadModel(modelId, modelTexturesId, cb = () => {}) {
  localStorage.setItem('modelId', modelId);
  if (modelTexturesId === undefined) modelTexturesId = 0;
  localStorage.setItem('modelTexturesId', modelTexturesId);
  loadlive2d(
    'live2d',
    'https://api.fghrsh.net/live2d/get/?id=' + modelId + '-' + modelTexturesId,
    console.log(
      'live2d',
      '模型 ' + modelId + '-' + modelTexturesId + ' 加载完成',
    ),
    cb(),
  );
}
