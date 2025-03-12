import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardHeader, Avatar, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AutoCompleteIcon from '@mui/icons-material/Autorenew';
import TranscribeIcon from '@mui/icons-material/Translate';
import DuplicateIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import AssistantIcon from '@mui/icons-material/Assistant';

const features = [
    { icon: <SearchIcon />, title: 'חיפוש חכם', description: 'חיפוש בשפה טבעית (NLP), למשל: "תמצא לי את החוזה עם לקוח X משנת 2022"', color: '#ff5722' },
    { icon: <SortIcon />, title: 'מיון אוטומטי', description: 'המערכת מזהה לבד איזה קובץ זה מסמך, תמונה, חוזה או קובץ קוד', color: '#4caf50' },
    { icon: <AutoCompleteIcon />, title: 'השלמה אוטומטית', description: 'תיוג קבצים חכם (AI מוסיף תגיות לבד)', color: '#2196f3' },
    { icon: <TranscribeIcon />, title: 'תמלול וניתוח תוכן', description: 'מסמכים סרוקים מקבלים OCR וזיהוי טקסט', color: '#9c27b0' },
    { icon: <DuplicateIcon />, title: 'זיהוי קבצים כפולים/מיושנים', description: 'המלצה למשתמש איזה קובץ למחוק', color: '#ff9800' },
    { icon: <SecurityIcon />, title: 'הגנה ואבטחה', description: 'סריקת קבצים לזיהוי קבצים חשודים', color: '#f44336' },
    { icon: <AssistantIcon />, title: 'Assistant חכם', description: 'משתמשי פרימיום מקבלים עוזר שממליץ איזה קובץ לשלוח, לארכב או למחוק', color: '#3f51b5' },
  ];

const Home: React.FC = () => {
    return (
        <Container>
          <Box textAlign="center" my={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              מנהל קבצים עם AI עוזר וירטואלי
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              מה הופך אותו למיוחד?
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar sx={{ bgcolor: feature.color }}>{feature.icon}</Avatar>}
                      title={feature.title}
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box my={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              פיצ'רים מרכזיים עם פירוט
            </Typography>
            <Box mb={4}>
              <Typography variant="h6" component="h3">
                🔍 חיפוש חכם עם NLP
              </Typography>
              <Typography>
                המשתמש מקליד חיפוש כמו: "מצא את כל הקבלות מ-2023". ה-Backend שולח את השאילתה ל-AI API כמו OpenAI או Google NLP. האלגוריתם מחפש במסד הנתונים לא רק לפי שם, אלא לפי תוכן ותגיות ומחזיר את הקבצים הכי רלוונטיים.
              </Typography>
            </Box>
            <Box mb={4}>
              <Typography variant="h6" component="h3">
                🗂️ מיון אוטומטי של קבצים
              </Typography>
              <Typography>
                ה-Backend ינתח את שם הקובץ + התוכן שלו. לדוגמה: אם קובץ מכיל מספרי IBAN → AI מזהה שזה חשבונית. אם יש המון קוד → מזהה שזה קובץ Python. הוספת תגיות אוטומטיות לכל קובץ.
              </Typography>
            </Box>
            <Box mb={4}>
              <Typography variant="h6" component="h3">
                🔄 זיהוי קבצים כפולים / ישנים
              </Typography>
              <Typography>
                המערכת תשווה תוכן בין קבצים ותזהה כפילויות. אם קובץ לא נפתח מעל X זמן → AI ישאל "למחוק?". אפשרות לאחד גרסאות שונות של מסמך.
              </Typography>
            </Box>
          </Box>
        </Container>
      );
};

export default Home;