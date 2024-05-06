#ftp://ftp.musicbrainz.org/pub/musicbrainz/bookbrainz/latest.sql.bz2  <- Link to the file

from ftplib import FTP

ftp_host = 'ftp.musicbrainz.org'
ftp_user = 'anonymous'
ftp_passwd = ''

def download_file_from_ftp(ftp_host, ftp_user, ftp_passwd, file_path, local_path):
    print('Connecting to FTP server...')
    with FTP(ftp_host) as ftp:
        print('Logging in...')
        ftp.login(user=ftp_user, passwd=ftp_passwd)
        
        ftp.cwd('/pub/musicbrainz/bookbrainz')
        
        print('Downloading file...')
        with open(local_path, 'wb') as local_file:
            ftp.retrbinary(f'RETR {file_path}', local_file.write)
        
    print(f'File downloaded successfully to: {local_path}')

def main():
    # File paths
    ftp_file_path = 'latest.sql.bz2'
    #local_file_path = 'Repos/BookMate/Database/latest.sql.bz2' 
    local_file_path = 'latest.sql.bz2' 

    download_file_from_ftp(ftp_host, ftp_user, ftp_passwd, ftp_file_path, local_file_path)

if __name__ == "__main__":
    main()
