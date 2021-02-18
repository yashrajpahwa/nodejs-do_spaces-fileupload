const url = 'https://example.region.digitaloceanspaces.com/161366766690.pdf';

console.log(
  `${url.split('digitaloceanspaces.com')[0]}cdn.digitaloceanspaces.com${
    url.split('digitaloceanspaces.com')[1]
  }`
);
