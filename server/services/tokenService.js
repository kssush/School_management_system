const jwt = require('jsonwebtoken')

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '30d'})

        return{ accessToken, refreshToken }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)

            return userData;
        } catch(e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)

            return userData;
        } catch(e){
            return null;
        }
    }

    saveToken(refreshToken){
        res.cookie("refreshToken", refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        });
    }

    removeToken(res){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax'
        })
    }

    findToken(req){
        const refreshToken = req.cookies.refreshToken;
        
        return refreshToken;
    }
}

module.exports = new TokenService()