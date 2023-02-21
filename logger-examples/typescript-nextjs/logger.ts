import { NextRequest, userAgent } from 'next/server'

export class logger {
  static async info(message: string, request: NextRequest) {
    this.log(request, 'INFO', message)
  }

  static async warn(message: string, request: NextRequest) {
    this.log(request, 'WARN', message)
  }

  static async error(message: string, request: NextRequest) {
    this.log(request, 'ERROR', message)
  }

  static async log(req: NextRequest, logLevel: string, logMessage: string) {
    const { isBot, browser, device, engine, os, cpu } = userAgent(req)

    const data = {
      event_ts: new Date().toISOString(),
      ip_address: req.ip,
      city: req.geo ? req.geo.city : 'unknown',
      country: req.geo ? req.geo.country : 'unknown',
      region: req.geo ? req.geo.region : 'unknown',
      latitude: req.geo ? req.geo.latitude : 'unknown',
      longitude: req.geo ? req.geo.longitude : 'unknown',
      protocol: req.headers.get('x-forwarded-proto') ? req.headers.get('x-forwarded-proto') : 'unknown',
      method: req.method,
      host: req.headers.get('host'),
      url: req.url,
      headers: Array.from(req.headers.keys()).join(','),
      useragent: req.headers.get('user-agent') ? req.headers.get('user-agent') : 'unknown',
      referer: req.headers.get('referer') ? req.headers.get('referer') : 'unknown',
      acceptencoding: req.headers.get('accept-encoding') ? req.headers.get('accept-encoding') : 'unknown',
      acceptlanguage: req.headers.get('accept-language') ? req.headers.get('accept-language') : 'unknown',
      acceptcharset: req.headers.get('accept-charset'),
      origin: req.headers.get('origin') ? req.headers.get('origin') : 'unknown',
      xforwaredforip: req.headers.get('x-forwarded-for') ? req.headers.get('x-forwarded-for') : 'unknown',
      connection: req.headers.get('connection') ? req.headers.get('connection') : 'unknown',
      cachecontrol: req.headers.has('cache-control')
        ? req.headers.get('cache-control')
        : 'unknown',
      contenttype: req.headers.get('content-type') ? req.headers.get('content-type') : 'unknown',
      from: req.headers.get('from') ? req.headers.get('from') : 'unknown',
      via: req.headers.get('via') ? req.headers.get('via') : 'unknown',
      contentlength: req.headers.get('content-length'),
      isbot: isBot,
      browsername: browser.name ? browser.name : 'unknown',
      browserversion: browser.version ? browser.version : 'unknown',
      devicemodel: device.model ? device.model : 'unknown',
      devicetype: device.type ? device.type : 'unknown',
      devicevendor: device.vendor ? device.vendor : 'unknown',
      enginename: engine.name ? engine.name : 'unknown',
      engineversion: engine.version ? engine.version : 'unknown',
      osname: os.name ? os.name : 'unknown',
      osversion: os.version ? os.version : 'unknown',
      cpuarchitecture: cpu.architecture ? cpu.architecture : 'unknown',
      log_level: logLevel,
      log_message: logMessage,
    }

    await this.sendToTinybird(data)
  }

  static async sendToTinybird(data: Record<string, unknown>) {
    await fetch(
      `https://api.tinybird.co/v0/events?name=logs`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}` },
      }
    )
  }
}
