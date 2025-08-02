
function extractBodyFromResponse(res) { // for food api
  const data = res.data;
  if (!data.header || !data.header.resultCode || data.header.resultCode != '00') {
    throw Error(`gov api error: ${data.body}`);
  }
  return data.body;
}

function extractResponseBodyFromResponse(res) { // for metro api
  const data = res.data;
  if (!data.response || !data.response.header || !data.response.header.resultCode || data.response.header.resultCode != '00') {
    throw Error(`gov api error: ${data.body}`);
  }
  return data.response.body;
}

/**
 * 
 * @param {*} body 
 * @returns {Array} 결과 배열 리스트
 */
function extractItemArrayOrDefualtEmptyArrayFromBody(body) { // for food api
  let result = [];
  if (body && body.items) {
    if (!Array.isArray(body.items)) {
      result = [body.items];
    } else {
      result = body.items;
    }
  }
  return result;
}

function extractItemArrayInItemsOrDefualtEmptyArrayFromBody(body) { // for metro api
  let result = [];
  if (body && body.items) {
    if (!Array.isArray(body.items.item)) {
      result = [body.items.item];
    } else {
      result = body.items.item;
    }
  }
  return result;
}

function extractPagingInfoOrDefaultEmptyObjectFromBody(body, appendObject = {}) {
  let paging = {
    numOfRows: Number(body.numOfRows),
    pageNo: body.pageNo,
    totalCount: body.totalCount,
  }

  Object.keys(appendObject).forEach(key => {
    paging[key] = appendObject[key];
  });

  return paging;
}

module.exports = {
  extractBodyFromResponse,
  extractResponseBodyFromResponse,
  extractItemArrayOrDefualtEmptyArrayFromBody,
  extractItemArrayInItemsOrDefualtEmptyArrayFromBody,
  extractPagingInfoOrDefaultEmptyObjectFromBody,
}
