using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class PlayerHealth : MonoBehaviour {

	public int startHealth = 100;
	public int currentHealth;
	public AudioClip deathClip;

	//shengmingUI
	public Slider healthSlider;
	public Image damageImage;
	public float flashSpeed = 5f;
	public Color flashColour = new Color (1f, 0f, 0f, 0.1f);

	AudioSource playerAudio;
	PlayerShooting playerShooting;
	PlayerMovement playermovement;

	Animator anima;

	bool isDead;	//是否死亡
	bool damaged;	//是否受到伤害


	void Awake(){
	
		playerShooting = GetComponentInChildren <PlayerShooting> ();
		playermovement = GetComponent<PlayerMovement> ();
		playerAudio = GetComponent <AudioSource> ();

		anima = GetComponent<Animator> ();

		//初始化生命值为当前生命值
		currentHealth = startHealth;
	}

	void Update(){

		if (damaged) {
			damageImage.color = flashColour;
		}
		else {
			damageImage.color = Color.Lerp (damageImage.color, Color.clear, flashSpeed * Time.deltaTime);
		}
		damaged = false;
	}

	public void TakeDamage(int amout){
	
		damaged = true;

		currentHealth -= amout;

		//shengmingUIjianshao
		healthSlider.value = currentHealth;

		playerAudio.Play ();

		if(currentHealth <= 0 && !isDead){

			Death ();
		}
	}

	void Death(){

		isDead = true;

		//放死亡动画
		anima.SetTrigger ("Die");

		//shengyin
		playerAudio.clip = deathClip;
		playerAudio.Play ();

		//禁用掉玩家的射击
		playerShooting.enabled = false;

		//禁用玩家的控制
		playermovement.enabled = false;
	
	}

	public void RestartLevel(){
	
		Application.LoadLevel (Application.loadedLevel);
	}


}
