
import React from 'react';
import Icon from './Icon';
import Button from './Button';

interface ShareButtonsProps {
    url: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    return (
        <div className="flex gap-2">
            <Button variant="secondary" size="sm">
                <Icon name="share" className="w-4 h-4 mr-2" /> Share
            </Button>
            {/* Add more specific share buttons as needed */}
        </div>
    );
};

export default ShareButtons;
